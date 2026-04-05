from django.db import models
from farms.models import Farm
from cloudinary.models import CloudinaryField
from categories.models import Category

class Product(models.Model):
    SEASON_CHOICES = [
        ("winter", "Winter"),
        ("spring", "Spring"),
        ("summer", "Summer"),
        ("fall", "fall"),
    ]

    farm = models.ForeignKey(
        Farm,
        on_delete=models.CASCADE,
        related_name="products"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    season = models.CharField(
        max_length=20,
        choices=SEASON_CHOICES,
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    in_stock = models.BooleanField(default=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="products"
    )

    average_rating = models.FloatField(default=0)
    review_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.in_stock = self.stock > 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = CloudinaryField(
        "product_image",
        folder="AGRIGOV/products",
        transformation={"quality": "auto", "fetch_format": "auto"}
    )

    def __str__(self):
        return f"Image for {self.product.title}"