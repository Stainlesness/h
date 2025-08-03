# marketplace/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path
from .views import generate_tags, enhance_description, service_suggestions

router = DefaultRouter()
router.register(r'businesses', views.BusinessViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'service-requests', views.ServiceRequestViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('nearby-businesses/', views.NearbyBusinessesView.as_view(), name='nearby-businesses'),


    path('enhance-description/', enhance_description, name='enhance-description'),
    path('enhance-description/', enhance_description, name='enhance-description'),
    path('service-suggestions/', service_suggestions, name='service-suggestions'),
]
