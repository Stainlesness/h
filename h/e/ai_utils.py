# marketplace/ai_utils.py
from transformers import pipeline
import logging
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Service
from django.core.cache import cache
from langdetect import detect, LangDetectException
 
logger = logging.getLogger(__name__)

def generate_product_tags(description):
    # First check cache
    cache_key = f"tags_{hash(description)}"
    if cached := cache.get(cache_key):
        return cached
    
    try:
        # Use smaller model with CPU optimization
        classifier = pipeline(
            "zero-shot-classification",
            model="valhalla/distilbart-mnli-12-3",  # Smaller model
            device=-1  # Force CPU usage
        )
        candidate_labels = [
            "electronics", "microcontroller", "sensor", "development board",
            "power tool", "pump", "motor", "component", "kit", "prototyping",
            "raspberry pi", "arduino", "esp32", "iot", "robotics"
        ]
        result = classifier(description, candidate_labels, multi_label=True)
        
        # Filter tags with high confidence
        tags = [
            label for label, score in zip(result['labels'], result['scores'])
            if score > 0.7
        ]
        tags = tags[:5]  # Return top 5 tags
        
        # Cache results
        cache.set(cache_key, tags, timeout=3600)  # Cache for 1 hour
        return tags
    except Exception as e:
        logger.error(f"AI tagging failed: {e}")
        return []


def enhance_description(text):
    """Improve business/service descriptions"""
    try:
        # Use text generation model to enhance descriptions
        generator = pipeline(
            "text2text-generation", 
            model="mrm8488/t5-base-finetuned-common_gen"
        )
        result = generator(f"improve business description: {text}", max_length=200)
        return result[0]['generated_text']
    except Exception as e:
        logger.error(f"AI description enhancement failed: {e}")
        return text

def service_suggestions(text):
    """Generate service suggestions based on user input"""
    try:
        # Get all service titles
        services = Service.objects.all().values_list('title', flat=True)
        service_titles = list(services)
        
        # If no services, return empty list
        if not service_titles:
            return []
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([text] + service_titles)
        
        # Calculate cosine similarity
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get top 5 suggestions
        top_indices = np.argsort(cosine_similarities)[::-1][:5]
        suggestions = [service_titles[i] for i in top_indices]
        
        return suggestions
    except Exception as e:
        logger.error(f"Service suggestions failed: {e}")
        return []

def is_swahili(text):
    try:
        return detect(text) == 'sw'
    except LangDetectException:
        return False

def enhance_description(text):
    try:
        # Detect language and select appropriate model
        if is_swahili(text):
            generator = pipeline(
                "text2text-generation", 
                model="mrm8488/mt5-base-finetuned-common_gen"
            )
        else:
            generator = pipeline(
                "text2text-generation", 
                model="mrm8488/t5-base-finetuned-common_gen"
            )
        
        result = generator(f"improve: {text}", max_length=200)
        return result[0]['generated_text']
    except Exception as e:
        logger.error(f"AI description enhancement failed: {e}")
        return text
