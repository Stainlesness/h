from rest_framework import viewsets, generics
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from .models import *
from .serializers import *
from .ai_utils import generate_product_tags, enhance_description
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Service
from .ai_utils import generate_product_tags, enhance_description
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from rest_framework.decorators import api_view
from .tasks import async_generate_tags
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import throttle_classes
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

class AITenPerMinute(UserRateThrottle):
    rate = '10/minute'

class StandardPagination(PageNumberPagination):
    page_size = 20  # Items per page
    page_size_query_param = 'page_size'
    max_page_size = 100

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer  # Use your existing UserSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class UserDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
@api_view(['POST'])
def generate_tags(request):
    text = request.data.get('text', '')
    
    # Input validation
    if len(text) > 1000:
        return Response({'error': 'Text too long'}, status=400)
    
    # Start async task
    task = async_generate_tags.delay(text)
    return Response({'task_id': task.id}, status=202)

# Add endpoint to check task status
@api_view(['GET'])
def get_tags_result(request, task_id):
    from celery.result import AsyncResult
    task_result = AsyncResult(task_id)
    
    if task_result.ready():
        return Response({'tags': task_result.result})
    else:
        return Response({'status': 'processing'}, status=202)

class BusinessViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination 
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 10)  # Default 10km radius
        
        if lat and lng:
            user_point = Point(float(lng), float(lat), srid=4326)
            queryset = queryset.annotate(
                distance=Distance('location', user_point)
            ).filter(distance__lte=radius * 1000).order_by('distance')
        
        return queryset

class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 10)  # Default 10km radius
        
        if lat and lng:
            user_point = Point(float(lng), float(lat), srid=4326)
            queryset = queryset.annotate(
                distance=Distance('location', user_point)
            ).filter(distance__lte=radius * 1000).order_by('distance')
        
        return queryset

class ServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Add this
    pagination_class = StandardPagination 
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 20)  # Default 20km radius
        
        if lat and lng:
            user_point = Point(float(lng), float(lat), srid=4326)
            queryset = queryset.annotate(
                distance=Distance('location', user_point)
            ).filter(distance__lte=radius * 1000).order_by('distance')
        
        return queryset

class NearbyBusinessesView(generics.ListAPIView):
    serializer_class = BusinessSerializer
    
    def get_queryset(self):
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 5)  # Default 5km radius
        
        if not lat or not lng:
            return Business.objects.none()
        
        user_point = Point(float(lng), float(lat), srid=4326)
        return Business.objects.annotate(
            distance=Distance('location', user_point)
        ).filter(distance__lte=radius * 1000).order_by('distance')

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    throttle_classes = [AnonRateThrottle]  
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
def enhance_description(request):
    text = request.data.get('text', '')
    enhanced_text = enhance_description(text)
    return Response({'enhanced_text': enhanced_text})

@api_view(['POST'])
def service_suggestions(request):
    text = request.data.get('text', '')
    
    # Get all service titles
    services = Service.objects.all().values_list('title', flat=True)
    service_titles = list(services)
    
    # If there are no services, return empty list
    if not service_titles:
        return Response({'suggestions': []})
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text] + service_titles)
    
    # Calculate cosine similarity
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # Get top 5 suggestions
    top_indices = np.argsort(cosine_similarities)[::-1][:5]
    suggestions = [service_titles[i] for i in top_indices]
    
    return Response({'suggestions': suggestions})

# Add to views.py
class ServiceAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(service__provider=self.request.user)

class UserServicesView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Service.objects.filter(provider=self.request.user)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def verify_service(request, pk):
    service = get_object_or_404(Service, pk=pk)
    service.verified = True
    service.save()
    return Response({'status': 'verified'})