# marketplace/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path
from .views import generate_tags, enhance_description, service_suggestions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Add these at the top of urls.py
from .views import (
    UserDetailView,
    ServiceAvailabilityViewSet,
    verify_service,
    get_tags_result
)
router = DefaultRouter()
router.register(r'businesses', views.BusinessViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'service-requests', views.ServiceRequestViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'availability', ServiceAvailabilityViewSet)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('api/users/me/', UserDetailView.as_view(), name='user_detail'),
    path('', include(router.urls)),
    path('nearby-businesses/', views.NearbyBusinessesView.as_view(), name='nearby-businesses'),
    path('enhance-description/', enhance_description, name='enhance-description'),
    path('api/task-status/<str:task_id>/', get_tags_result, name='task-status'),
    path('service-suggestions/', service_suggestions, name='service-suggestions'),
    path('api/service-requests/', include(router.urls)),
    path('services/<int:pk>/verify/', verify_service, name='verify-service')
]
