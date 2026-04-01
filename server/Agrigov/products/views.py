from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import (
    ProductSerializer,
    CreateProductSerializer,
    UpdateProductSerializer,
)
from .filters import ProductFilter
from .permissions import IsFarmerOwner


class ProductListView(generics.ListAPIView):
    queryset = (
        Product.objects.all()
        .select_related("farm", "farm__farmer", "category")
        .prefetch_related("images")
    )
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "description", "category__name"]
    ordering_fields = ["unit_price", "created_at", "average_rating", "stock"]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all().prefetch_related("images")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(
            farm__farmer=self.request.user
        ).select_related("farm", "category").prefetch_related("images")


class CreateProductView(generics.CreateAPIView):
    serializer_class = CreateProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}


class UpdateProductView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = UpdateProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmerOwner]

    def get_serializer_context(self):
        return {"request": self.request}


class DeleteProductView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsFarmerOwner]