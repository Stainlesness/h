# marketplace/serializers.py
from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type', 'phone', 'location', 'address']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BusinessSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = Business
        fields = '__all__'
    
    def get_location(self, obj):
        if obj.location:
            return {'lat': obj.location.y, 'lng': obj.location.x}
        return None

class ProductSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_location(self, obj):
        if obj.location:
            return {'lat': obj.location.y, 'lng': obj.location.x}
        return None

class ServiceSerializer(serializers.ModelSerializer):
    provider = UserSerializer(read_only=True)
    location = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = '__all__'
    
    def get_location(self, obj):
        if obj.location:
            return {'lat': obj.location.y, 'lng': obj.location.x}
        return None

class ServiceRequestSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    customer = UserSerializer(read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'
        extra_kwargs = {
            'service': {'read_only': True}
        }