from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer
)


class ConversationListView(generics.ListCreateAPIView):
    """
    GET  /api/chat/     - List all conversations for current user
    POST /api/chat/     - Start a new conversation
    Body: { product_id: 22, farm_id: 13 }
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ConversationDetailSerializer
        return ConversationListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(farmer=user) | Q(buyer=user),
            is_active=True
        ).prefetch_related('messages').order_by('-updated_at')

    def perform_create(self, serializer):
        user = self.request.user
        farm_id = self.request.data.get('farm_id')
    
        if user.role == 'BUYER':
            if not farm_id:
                raise ValidationError({'farm_id': 'Farm ID is required.'})
    
            try:
                farm_id = int(farm_id)
            except (ValueError, TypeError):
                raise ValidationError({'error': 'Invalid farm_id.'})
    
            # Get the farmer user from the farm
            from farms.models import Farm
            try:
                farm = Farm.objects.select_related('farmer').get(id=farm_id)
                farmer = farm.farmer
            except Farm.DoesNotExist:
                raise ValidationError({'farm_id': f'Farm not found.'})
    
            # Check if conversation already exists for this buyer-farmer pair
            existing = Conversation.objects.filter(
                buyer=user,
                farmer=farmer,
                is_active=True
            ).first()
    
            if existing:
                serializer.instance = existing
                return
    
            # Create ONE conversation per buyer-farmer pair
            conversation = Conversation.objects.create(
                buyer=user,
                farmer=farmer
            )
            serializer.instance = conversation
    
        elif user.role == 'FARMER':
            buyer_id = self.request.data.get('buyer_id')
            if buyer_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                try:
                    buyer = User.objects.get(id=int(buyer_id))
                except User.DoesNotExist:
                    raise ValidationError({'buyer_id': 'Buyer not found.'})
    
                existing = Conversation.objects.filter(
                    buyer=buyer,
                    farmer=user,
                    is_active=True
                ).first()
    
                if existing:
                    serializer.instance = existing
                    return
    
                conversation = Conversation.objects.create(
                    buyer=buyer,
                    farmer=user
                )
                serializer.instance = conversation
            else:
                raise ValidationError({'buyer_id': 'Buyer ID is required.'})
    
        else:
            raise ValidationError({'role': 'Only farmers and buyers can chat.'})


class ConversationDetailView(generics.RetrieveAPIView):
    """
    GET /api/chat/{id}/
    Get conversation with all messages, mark unread as read
    """
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(f"[CHAT LIST] User: {user.username}, ID: {user.id}, Role: {user.role}")

        convs = Conversation.objects.filter(
            Q(farmer=user) | Q(buyer=user),
            is_active=True
        ).prefetch_related('messages').order_by('-updated_at')

        print(f"[CHAT LIST] Found {convs.count()} conversations")
        for c in convs:
            print(f"  - Conv {c.id}: {c.buyer.username} ↔ {c.farmer.username}")

        return convs
    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object()
        
        # Mark ALL messages from the OTHER person as read
        updated = conversation.messages.filter(
            is_read=False
        ).exclude(
            sender=request.user
        ).update(is_read=True)
        
        print(f"[CHAT] Marked {updated} messages as read for user {request.user.username}")
        
        return super().retrieve(request, *args, **kwargs)

class SendMessageView(APIView):
    """
    POST /api/chat/{conversation_id}/send/
    Body: { content: "Hello!" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id):
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
            is_active=True
        )

        # Check if user is part of this conversation
        if request.user.id != conversation.farmer_id and request.user.id != conversation.buyer_id:
            return Response(
                {'error': 'You are not part of this conversation.'},
                status=status.HTTP_403_FORBIDDEN
            )

        content = request.data.get('content', '').strip()
        if not content:
            return Response(
                {'error': 'Message cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )

        # Update conversation timestamp
        conversation.save()

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )


class UnreadCountView(APIView):
    """
    GET /api/chat/unread/
    Get total unread messages count for current user
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_conversations = Conversation.objects.filter(
            Q(farmer=request.user) | Q(buyer=request.user),
            is_active=True
        )

        count = Message.objects.filter(
            conversation__in=user_conversations,
            is_read=False
        ).exclude(
            sender=request.user
        ).count()

        return Response({
            'unread_count': count
        })