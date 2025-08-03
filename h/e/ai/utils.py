# marketplace/ai_utils.py
from transformers import pipeline
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

def generate_product_tags(description):
    try:
        # Use a lightweight model for efficiency
        classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
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
        return tags[:5]  # Return top 5 tags
    except Exception as e:
        logger.error(f"AI tagging failed: {e}")
        return []

def enhance_description(text):
    try:
        # Use a text generation model to improve descriptions
        generator = pipeline(
            "text2text-generation", 
            model="mrm8488/t5-base-finetuned-common_gen"
        )
        result = generator(f"improve: {text}", max_length=200)
        return result[0]['generated_text']
    except Exception as e:
        logger.error(f"AI description enhancement failed: {e}")
        return text

def match_services_to_request(request_text, services):
    """Match services to customer request using text similarity"""
    try:
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer()
        texts = [request_text] + [s.description for s in services]
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Calculate cosine similarity
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Pair services with similarity scores
        scored_services = sorted(
            zip(services, cosine_similarities), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        return scored_services
    except Exception as e:
        logger.error(f"Service matching failed: {e}")
        return list(zip(services, [0]*len(services)))
