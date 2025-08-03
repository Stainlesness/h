# marketplace/tasks.py
from celery import shared_task
from .ai_utils import generate_product_tags

@shared_task
def async_generate_tags(description):
    return generate_product_tags(description)
