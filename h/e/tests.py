from django.test import TestCase

# Create your tests here.
from .models import Service

# tests/test_services.py
class ServiceTestCase(TestCase):
    def test_service_radius_filter(self):
        service = Service.objects.create(...)
        results = Service.objects.filter(
            service_radius__gte=10
        )
        self.assertIn(service, results)