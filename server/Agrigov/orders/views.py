from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer, CheckoutSerializer


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = Order.objects.select_related(
            'buyer', 'farm'
        ).prefetch_related(
            'items__product'
        )

        if user.role == 'BUYER':
            return queryset.filter(buyer=user.buyer_profile)

        if user.role == 'FARMER':
            return queryset.filter(farm__farmer=user)

        if user.role == 'TRANSPORTER':
            return queryset.filter(status__in=['confirmed', 'shipped'])

        if user.role == 'ADMIN':
            return queryset

        return Order.objects.none()

    # -------------------
    # CHECKOUT (🔥 main feature)
    # -------------------
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        serializer = CheckoutSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        orders = serializer.save()

        return Response(
            OrderSerializer(orders, many=True, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    # -------------------
    # CHANGE STATUS (clean)
    # -------------------
    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response({'error': 'Status required'}, status=400)

        if not order.can_user_change_status(request.user, new_status):
            return Response({'error': 'Not allowed'}, status=403)

        order.status = new_status
        order.save()

        return Response(
            OrderSerializer(order, context={'request': request}).data
        )