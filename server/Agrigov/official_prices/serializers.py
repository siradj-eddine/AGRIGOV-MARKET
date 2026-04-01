from rest_framework import serializers
from .models import OfficialPrice
from regions.utils import get_region_from_wilaya

class OfficialPriceSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)
    
    # CRITICAL: This line tells Django to use the function 'get_region' 
    # instead of the database column 'region'
    region_name = serializers.SerializerMethodField()

    class Meta:
        model = OfficialPrice
        fields = [
            'id',
            'product_name',
            'wilaya',
            'min_price',
            'max_price',
            'unit',
            'valid_from',
            'valid_until',
            'is_active',
            'region_name', # This now points to the MethodField above
        ]

    def get_region_name(self, obj):
        """
        This logic runs every time the API is called.
        It converts 'Alger' to 'north' dynamically.
        """
        if obj.wilaya:
            return get_region_from_wilaya(obj.wilaya)
        
        # If no wilaya, return the DB value or 'National'
        return obj.region if obj.region else "National"

    def validate(self, data):
        if data.get('min_price') and data.get('max_price'):
            if data['min_price'] > data['max_price']:
                raise serializers.ValidationError("Invalid price range: min must be less than max")
        return data