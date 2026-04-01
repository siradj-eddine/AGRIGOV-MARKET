import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    # 💰 PRICE RANGE
    min_price = django_filters.NumberFilter(field_name="unit_price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="unit_price", lookup_expr="lte")

    # 📂 CATEGORY
    category = django_filters.CharFilter(field_name="category__slug")
    category_id = django_filters.NumberFilter(field_name="category__id")

    # 🌱 SEASON
    season = django_filters.ChoiceFilter(choices=Product.SEASON_CHOICES)

    # 📦 STOCK
    in_stock = django_filters.BooleanFilter()
    min_stock = django_filters.NumberFilter(field_name="stock", lookup_expr="gte")

    # 🚜 FARM
    farm = django_filters.NumberFilter(field_name="farm__id")

    # ⭐ RATING
    min_rating = django_filters.NumberFilter(field_name="average_rating", lookup_expr="gte")

    # 📅 DATE
    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")

    # 🔥 CUSTOM: has images
    has_images = django_filters.BooleanFilter(method="filter_has_images")

    class Meta:
        model = Product
        fields = [
            "category",
            "category_id",
            "season",
            "in_stock",
            "farm",
        ]

    def filter_has_images(self, queryset, name, value):
        if value:
            return queryset.filter(images__isnull=False).distinct()
        return queryset