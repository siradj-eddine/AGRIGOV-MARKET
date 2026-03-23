from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, MeView, FarmerProfileView, TransporterProfileView, BuyerProfileView

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("me/", MeView.as_view()),
    path("auth/farmer-profile/", FarmerProfileView.as_view()),
    path("auth/transporter-profile/", TransporterProfileView.as_view()),
    path("auth/buyer-profile/", BuyerProfileView.as_view()),
]