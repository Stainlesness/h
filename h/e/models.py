# marketplace/models.py
from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models as db_models
from django.contrib.contenttypes.models import ContentType
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPES = (
        ('CUSTOMER', 'Customer'),
        ('BUSINESS', 'Business'),
        ('SERVICE', 'Service Provider'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='CUSTOMER')
    phone = models.CharField(max_length=15)
    location = models.PointField(geography=True, srid=4326)
    address = models.CharField(max_length=255, blank=True)
    profile_pic = models.ImageField(
        upload_to='profiles/',
        validators=[FileExtensionValidator(['jpg', 'png'])],
        default='SRID=4326;POINT(0 0)',
        null=False,
        blank=True
    )
    # Add these to resolve the clash
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="custom_user_set",  # Changed from 'user_set'
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_set",  # Changed from 'user_set'
        related_query_name="custom_user",
    )
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='bi-box')

    def __str__(self):
        return self.name

class Business(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    location = models.PointField(geography=True, srid=4326, default='SRID=4326;POINT(0 0)')
    address = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    CONDITION_CHOICES = (
        ('NEW', 'Brand New'),
        ('USED', 'Used'),
        ('REFURB', 'Refurbished'),
    )
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='NEW')
    location = models.PointField(geography=True, srid=4326, default='SRID=4326;POINT(0 0)')
    stock = models.PositiveIntegerField(default=1)
    ai_tags = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Service(models.Model):
    provider = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    fixed_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    service_radius = models.PositiveIntegerField(
        default=20,  # Default 20km radius
        help_text="Service coverage radius in kilometers"
    )
    location = models.PointField(geography=True, srid=4326, default='SRID=4326;POINT(0 0)')
    ai_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.hourly_rate and not self.fixed_price:
            raise ValidationError("Set either hourly_rate or fixed_price.")
        if self.service_radius > 100:  # Max 100km radius
            raise ValidationError("Service radius cannot exceed 100km.")
   
    class Meta:
        indexes = [
            models.Index(fields=['location']),
            models.Index(fields=['service_radius'])
        ]
        
# models.py
class Availability(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    day = models.PositiveSmallIntegerField() # 0-6 (Monday-Sunday)
    start_time = models.TimeField()
    end_time = models.TimeField()

class ServiceRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
        ('REJECTED', 'Rejected'),
    )
    
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateTimeField(null=True)

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)





# AI Models (Separate app)
class AIEmbedding(models.Model):
    content_type = models.CharField(max_length=50)  # 'product' or 'service'
    object_id = models.PositiveIntegerField()
    embedding = models.JSONField()  # Vector embeddings for similarity search


