from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import OfficialPrice
from .serializers import OfficialPriceSerializer
from .permissions import IsAdmin, IsFarmer
from .services import get_active_price, validate_price, expire_old_price

# =========================
# PUBLIC
# =========================
class CurrentPriceView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        product_name = request.query_params.get('product_name')
        wilaya = request.query_params.get('wilaya', '')

        if not product_name:
            return Response({"error": "product_name is required"}, status=status.HTTP_400_BAD_REQUEST)

        price = get_active_price(product_name, wilaya)

        if not price:
            return Response({"error": f"No active price found for {product_name}"}, status=status.HTTP_404_NOT_FOUND)

        return Response(OfficialPriceSerializer(price).data)

# =========================
# ADMIN
# =========================
class OfficialPriceCreateView(generics.CreateAPIView):
    queryset = OfficialPrice.objects.all()
    serializer_class = OfficialPriceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        product_name = serializer.validated_data.get('product_name')
        wilaya = serializer.validated_data.get('wilaya', '')
        region = serializer.validated_data.get('region', '')
        
        # Expire the old price accurately based on wilaya and region
        expire_old_price(product_name, wilaya, region)
        
        serializer.save(set_by=self.request.user)

class OfficialPriceUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OfficialPrice.objects.all()
    serializer_class = OfficialPriceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        serializer.save(set_by=self.request.user)