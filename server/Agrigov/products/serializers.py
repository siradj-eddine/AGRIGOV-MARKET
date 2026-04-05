from rest_framework import serializers
from .models import Product, ProductImage
from categories.models import Category
from django.db import transaction
from official_prices.services import validate_price, get_active_price
from farms.models import Farm
from farms.serializers import FarmSerializer

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image"]

    def get_image(self, obj):
        return obj.image.url


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    farmer_name = serializers.CharField(source="farm.farmer.username", read_only=True)
    farm = FarmSerializer(read_only=True)
    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.filter(is_active=True)
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "farm",
            "farmer_name",
            "description",
            "season",
            "unit_price",
            "stock",
            "in_stock",
            "category",
            "images",
            "average_rating",
            "review_count",
            "created_at",
        ]


class CreateProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    farm_id = serializers.IntegerField(write_only=True)

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True)
    )

    unit_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            "title",
            "description",
            "season",
            "unit_price",
            "stock",
            "category",
            "farm_id",
            "images",
        ]

    def validate_farm_id(self, value):
        user = self.context["request"].user

        if not Farm.objects.filter(id=value, farmer=user).exists():
            raise serializers.ValidationError("Invalid farm or not yours")

        return value

    def validate(self, data):
        farm_id = data.get("farm_id")
        unit_price = data.get("unit_price")
        title = data.get("title").strip()

        try:
            farm = Farm.objects.get(id=farm_id)
        except Farm.DoesNotExist:
            raise serializers.ValidationError({"farm_id": "Farm not found"})

        wilaya = getattr(farm, "wilaya", "") or ""

        is_valid, price_range, message = validate_price(
            product_name=title,
            price=unit_price,
            wilaya=wilaya
        )

        if not price_range:
            raise serializers.ValidationError({
                "title": f"No official price found for product '{title}'. Please contact the ministry."
            })

        if not is_valid:
            raise serializers.ValidationError({
                "unit_price": message
            })

        # optional: attach for later use
        data["_official_price"] = price_range

        return data

    @transaction.atomic
    def create(self, validated_data):
        images = validated_data.pop("images", [])
        farm_id = validated_data.pop("farm_id")
        validated_data.pop("_official_price", None)
        unit_price = validated_data.pop("unit_price")

        farm = Farm.objects.get(id=farm_id)

        product = Product.objects.create(
            farm=farm,
            unit_price=unit_price,
            **validated_data
        )

        for img in images:
            ProductImage.objects.create(product=product, image=img)

        return product


class UpdateProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.filter(is_active=True),
        required=False
    )

    class Meta:
        model = Product
        fields = [
            "title",
            "description",
            "season",
            "unit_price",
            "stock",
            "category",
            "images",
        ]

    def validate(self, data):
        product = self.instance
        unit_price = data.get("unit_price", product.unit_price)

        wilaya = getattr(product.farm, "wilaya", "") or ""

        is_valid, price_range, message = validate_price(
                product_name=data.get("title"),  # ← Pass product name, not ID
                price=unit_price,
                wilaya=wilaya
                )

        if not is_valid:
            raise serializers.ValidationError({"unit_price": message})

        if not price_range:
            raise serializers.ValidationError({
                "title": f"No official price found for product '{product.title}'. Contact the ministry."
            })

        return data

    @transaction.atomic
    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if images is not None:
            for img in instance.images.all():
                img.image.delete(save=False)
                img.delete()
            for img in images:
                ProductImage.objects.create(product=instance, image=img)

        return instance