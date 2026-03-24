from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.price


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer = serializers.StringRelatedField()
    farm = serializers.StringRelatedField()
    allowed_statuses = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'buyer',
            'farm',
            'total_price',
            'status',
            'created_at',
            'items',
            'allowed_statuses'
        ]

    def get_allowed_statuses(self, obj):
        request = self.context.get('request')
        if request:
            return obj.get_allowed_statuses_for_user(request.user)
        return []


# 🔥 CHECKOUT SERIALIZER
class CheckoutSerializer(serializers.Serializer):
    cart_id = serializers.IntegerField(required=False)

    def validate(self, data):
        from cart.models import Cart

        user = self.context['request'].user
        buyer = getattr(user, 'buyer_profile', None)

        if not buyer:
            raise serializers.ValidationError("Buyer profile required")

        cart = None

        if data.get('cart_id'):
            cart = Cart.objects.filter(id=data['cart_id'], buyer=buyer).first()
            if not cart:
                raise serializers.ValidationError("Cart not found")
        else:
            cart = getattr(buyer, 'cart', None)

        if not cart or not cart.items.exists():
            raise serializers.ValidationError("Cart is empty")

        data['cart'] = cart
        data['buyer'] = buyer
        return data

    def create(self, validated_data):
        from .utils import create_orders_from_cart

        return create_orders_from_cart(
            validated_data['buyer'],
            validated_data['cart']
        )