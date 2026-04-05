from django.utils import timezone
from django.db.models import Q
from .models import OfficialPrice
from regions.utils import get_region_from_wilaya

def normalize_name(name: str) -> str:
    return name.strip().lower()


def get_active_price(product_name, wilaya=None):
    now = timezone.now()
    product_name = normalize_name(product_name)

    queryset = OfficialPrice.objects.filter(
        product_name__iexact=product_name,
        valid_from__lte=now
    ).filter(
        Q(valid_until__isnull=True) | Q(valid_until__gte=now)
    )

    if wilaya:
        # 1. Exact Wilaya match (e.g., specific price for 'Adrar')
        regional = queryset.filter(wilaya__iexact=wilaya).first()
        if regional:
            return regional
            
        # 2. Broad Region match (e.g., fallback to 'south' price)
        region_name = get_region_from_wilaya(wilaya)
        if region_name:
            # FIX: Filter by the 'region' field, not 'wilaya'!
            broad_regional = queryset.filter(region__iexact=region_name, wilaya='').first()
            if broad_regional:
                return broad_regional

    # 3. Fallback to National price (where both are empty)
    national = queryset.filter(wilaya='', region='').first()
    return national


def validate_price(product_name, price, wilaya=None):
    price_range = get_active_price(product_name, wilaya)

    if not price_range:
        return False, None, f"No official price defined for '{product_name}'"

    if not (price_range.min_price <= price <= price_range.max_price):
        return False, price_range, (
            f"Price must be between {price_range.min_price} "
            f"and {price_range.max_price} {price_range.unit}"
        )

    return True, price_range, "Valid price"


def expire_old_price(product_name, wilaya='', region=''):
    """Sets valid_until to 'now' for the currently active price before creating a new one"""
    now = timezone.now()
    active_prices = OfficialPrice.objects.filter(
        product_name__iexact=product_name,
        wilaya=wilaya,
        region=region,
        valid_from__lte=now
    ).filter(
        Q(valid_until__isnull=True) | Q(valid_until__gte=now)
    )
    active_prices.update(valid_until=now)