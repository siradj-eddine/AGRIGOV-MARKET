from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User, FarmerProfile, TransporterProfile, BuyerProfile
from farms.models import Farm
from vehicules.models import Vehicle

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "phone", "role", "is_verified", "created_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "username", "phone", "role", "password"]

    def validate_role(self, value):
        if value not in [User.ROLE_FARMER, User.ROLE_BUYER, User.ROLE_TRANSPORTER]:
            raise serializers.ValidationError("Invalid role for registration.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data, password=password)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs["user"] = user
        return attrs


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = [
            "age",
            "wilaya",
            "baladiya",
            "farm_size",
            "address",
            "farmer_card_image",
            "national_id_image",
        ]

    def create(self, validated_data):
        user = self.context["request"].user

        if user.role != User.ROLE_FARMER:
            raise serializers.ValidationError("Only farmers allowed")

        if hasattr(user, "farmer_profile"):
            raise serializers.ValidationError("Profile already exists")

        return FarmerProfile.objects.create(user=user, **validated_data)


class TransporterProfileSerializer(serializers.ModelSerializer):
    vehicle_type = serializers.CharField(write_only=True)
    vehicle_model = serializers.CharField(write_only=True)
    vehicle_year = serializers.IntegerField(write_only=True)
    vehicle_capacity = serializers.FloatField(write_only=True)

    class Meta:
        model = TransporterProfile
        fields = [
            "age",
            "driver_license_image",
            "grey_card_image",
            "vehicle_type",
            "vehicle_model",
            "vehicle_year",
            "vehicle_capacity",
        ]

    def create(self, validated_data):
        user = self.context["request"].user

        if user.role != User.ROLE_TRANSPORTER:
            raise serializers.ValidationError("Only transporters allowed")

        if hasattr(user, "transporter_profile"):
            raise serializers.ValidationError("Profile already exists")

        # Extract vehicle data
        vehicle_data = {
            "type": validated_data.pop("vehicle_type"),
            "model": validated_data.pop("vehicle_model"),
            "year": validated_data.pop("vehicle_year"),
            "capacity": validated_data.pop("vehicle_capacity"),
        }

        # Create profile
        profile = TransporterProfile.objects.create(user=user, **validated_data)

        # Create first vehicle
        Vehicle.objects.create(transporter=user, **vehicle_data)

        return profile
    
class BuyerProfileSerializer(serializers.ModelSerializer):
    bussiness_license_image = serializers.ImageField(write_only=True)

    class Meta:
        model = BuyerProfile
        fields = [
            "age",
            "bussiness_license_image",
        ]

    def create(self, validated_data):
        user = self.context["request"].user

        if user.role != User.ROLE_BUYER:
            raise serializers.ValidationError("Only buyers allowed")

        if hasattr(user, "buyer_profile"):
            raise serializers.ValidationError("Profile already exists")

        return BuyerProfile.objects.create(user=user, **validated_data)    