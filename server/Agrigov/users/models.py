from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from cloudinary.models import CloudinaryField



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.ROLE_ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        if extra_fields.get("role") != User.ROLE_ADMIN:
            raise ValueError("Superuser must have role=ADMIN")

        return self.create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    ROLE_FARMER = "FARMER"
    ROLE_BUYER = "BUYER"
    ROLE_TRANSPORTER = "TRANSPORTER"
    ROLE_ADMIN = "ADMIN"

    ROLE_CHOICES = [
        (ROLE_FARMER, "Farmer"),
        (ROLE_BUYER, "Buyer"),
        (ROLE_TRANSPORTER, "Transporter"),
        (ROLE_ADMIN, "Admin"),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, db_index=True)

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"



class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="farmer_profile")

    age = models.PositiveIntegerField()
    wilaya = models.CharField(max_length=100)
    baladiya = models.CharField(max_length=100)
    farm_size = models.FloatField(help_text="In hectares")
    address = models.TextField()

    farmer_card_image = CloudinaryField(
        "farmer_card",
        folder="AGRIGOV/farmers/farmerCards",
        transformation={"quality": "auto", "fetch_format": "auto"},
    )
    national_id_image = CloudinaryField("national_id" , folder="AGRIGOV/farmers/ids",
            transformation={"quality": "auto", "fetch_format": "auto"})

    is_validated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"FarmerProfile - {self.user.email}"



class TransporterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="transporter_profile")
    age = models.PositiveIntegerField()

    driver_license_image = CloudinaryField("driver_license" , folder="AGRIGOV/transporters/Permits" , transformation={"quality": "auto", "fetch_format": "auto"})
    grey_card_image = CloudinaryField("grey_card" , folder="AGRIGOV/transporters/greyCards" , transformation={"quality": "auto", "fetch_format": "auto"})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"TransporterProfile - {self.user.email}"

class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="buyer_profile")
    age = models.PositiveIntegerField()
    
    bussiness_license_image = CloudinaryField("business_license" , folder="AGRIGOV/buyers/businessLicenses" , transformation={"quality": "auto", "fetch_format": "auto"})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"BuyerProfile - {self.user.email}"