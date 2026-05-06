from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'is_read']


class ConversationListSerializer(serializers.ModelSerializer):
    """Used for GET /api/chat/ - list of conversations"""
    farmer = UserMinimalSerializer(read_only=True)
    buyer = UserMinimalSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'farmer', 'buyer', 
            'last_message', 'unread_count', 
            'created_at', 'updated_at'
        ]

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        return MessageSerializer(last_msg).data if last_msg else None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Used for GET /api/chat/{id}/ - single conversation with messages"""
    farmer = UserMinimalSerializer(read_only=True)
    buyer = UserMinimalSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'farmer', 'buyer', 'messages',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['farmer', 'buyer', 'created_at', 'updated_at']