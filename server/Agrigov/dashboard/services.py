from django.db.models import Avg, F, Sum, Q, Count, Max, Min
from django.utils import timezone
from datetime import timedelta

from orders.models import Order, OrderItem
from products.models import Product
from reviews.models import Review
from users.models import TransporterProfile
from official_prices.models import OfficialPrice
from regions.services import get_region_comparison

class DashboardService:

    @staticmethod
    def get_farmer_dashboard(user):
        farm = getattr(user, 'farm', None)
        if not farm:
            return {"error": "No farm profile found."}

        products = Product.objects.filter(farm=farm)
        farmer_orders = Order.objects.filter(farm=farm)
        delivered_orders = farmer_orders.filter(status='delivered')

        # 1. Calculate Current Stock Value
        # We multiply the current stock by the unit_price for every product on the farm
        stock_value_data = products.aggregate(
            total_value=Sum(F('stock') * F('unit_price'))
        )
        total_stock_value = stock_value_data.get('total_value') or 0

        # 2. Standard metrics
        revenue_data = delivered_orders.aggregate(total=Sum('total_price'))
        total_revenue = revenue_data.get('total') or 0
        
        low_stock_alerts = products.filter(stock__lt=10).count()

        return {
            "business_summary": {
                "total_products": products.count(),
                "total_revenue": float(total_revenue),
                "average_rating": round(products.aggregate(avg=Avg('average_rating')).get('avg') or 0, 2),
            },
            "inventory_status": {
                "total_items_in_stock": products.aggregate(total=Sum('stock')).get('total') or 0,
                "potential_stock_value": float(total_stock_value), # NEW METRIC
                "low_stock_warnings": low_stock_alerts,
            },
            "order_metrics": {
                "pending_orders": farmer_orders.filter(status='pending').count(),
                "total_items_sold": OrderItem.objects.filter(
                    order__farm=farm, 
                    order__status='delivered'
                ).aggregate(total=Sum('quantity')).get('total') or 0,
            }
        }
    @staticmethod
    def get_buyer_dashboard(user):
        """Buyer Insights: Tracks spending and orders."""
        buyer = getattr(user, 'buyer_profile', None)
        if not buyer:
            return {"error": "No buyer profile found"}

        orders = Order.objects.filter(buyer=buyer)
        
        return {
            "spending_analysis": {
                "total_spent": float(orders.filter(status='delivered').aggregate(total=Sum('total_price')).get('total') or 0),
                "average_order_value": float(orders.aggregate(avg=Avg('total_price')).get('avg') or 0),
            },
            "order_tracking": {
                "active_shipments": orders.filter(status='shipped').count(),
                "completed_orders": orders.filter(status='delivered').count(),
            },
            "engagement": {
                "reviews_written": Review.objects.filter(buyer=buyer).count(),
            }
        }

    @staticmethod
    def get_transporter_dashboard(user):
        """Logistics Hub: Individual performance."""
        transporter = getattr(user, 'transporter_profile', None)
        if not transporter:
            return {"error": "No transporter profile found"}

        assigned_orders = Order.objects.filter(transporter=transporter)
        total_orders = assigned_orders.count()
        delivered_count = assigned_orders.filter(status='delivered').count()

        return {
            "delivery_performance": {
                "total_completed": delivered_count,
                "currently_shipping": assigned_orders.filter(status='shipped').count(),
                "success_rate": f"{(delivered_count / total_orders * 100) if total_orders > 0 else 0:.1f}%",
            },
            "profile_info": {
                "vehicle": getattr(transporter, 'vehicle_type', 'Not Set'),
                "is_available": getattr(transporter, 'is_available', True),
            }
        }

    @staticmethod
    def get_admin_dashboard():
        """National Ministry Dashboard."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        now = timezone.now()
        last_30_days = now - timedelta(days=30)

        active_prices = OfficialPrice.objects.filter(
            Q(valid_until__isnull=True) | Q(valid_until__gte=now),
            valid_from__lte=now
        )

        revenue_data = Order.objects.filter(status='delivered').aggregate(total=Sum('total_price'))
        price_stats = active_prices.aggregate(max_p=Max('max_price'), min_p=Min('min_price'))

        return {
            "national_stats": {
                "total_users": User.objects.count(),
                "new_registrations_30d": User.objects.filter(created_at__gte=last_30_days).count(),
                "total_market_revenue": float(revenue_data.get('total') or 0),
            },
            "price_control_hub": {
                "active_official_prices": active_prices.count(),
                "price_ceiling_max": float(price_stats.get('max_p') or 0),
                "price_floor_min": float(price_stats.get('min_p') or 0),
            },
            "logistics_network": {
                "total_transporters": TransporterProfile.objects.count(),
                "active_logistics_load": Order.objects.filter(status='shipped').count(),
            },
            "regions_performance": get_region_comparison()
        }   