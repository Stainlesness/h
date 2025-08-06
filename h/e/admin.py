from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

try:
    from django.contrib.gis.admin import OSMGeoAdmin
    GeoAdmin = OSMGeoAdmin
except ImportError:
    GeoAdmin = admin.ModelAdmin

from .models import User, Business, Product, Service, ServiceRequest, Review, Category

@admin.register(get_user_model())
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 
                                    'user_type', 'address', 'profile_pic')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 
                                 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Location', {'fields': ('location',)}),
    )
    list_display = ('username', 'email', 'user_type', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'user_type')
    search_fields = ('username', 'first_name', 'last_name', 'email')

@admin.register(Business)
class BusinessAdmin(GeoAdmin):
    list_display = ('name', 'owner', 'category', 'verified')
    list_filter = ('verified', 'category')
    search_fields = ('name', 'owner__username')

@admin.register(Product)
class ProductAdmin(GeoAdmin):
    list_display = ('name', 'business', 'price', 'condition')
    list_filter = ('condition', 'category')
    search_fields = ('name', 'business__name')

@admin.register(Service)
class ServiceAdmin(GeoAdmin):
    list_display = ('title', 'provider', 'category', 'hourly_rate')
    list_filter = ('category',)
    search_fields = ('title', 'provider__username')

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('service', 'customer', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('service__title', 'customer__username')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('reviewer__username',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)