# Use official Python image
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TRANSFORMERS_OFFLINE=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Pre-download models during build
RUN python -c "from transformers import pipeline; pipeline('zero-shot-classification', model='valhalla/distilbart-mnli-12-3')"
RUN python -c "from transformers import pipeline; pipeline('text2text-generation', model='mrm8488/t5-base-finetuned-common_gen')"
RUN python -c "from transformers import pipeline; pipeline('text2text-generation', model='mrm8488/mt5-base-finetuned-common_gen')"

# Run migrations and collect static files
RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "yourproject.wsgi:application", "--bind", "0.0.0.0:8000"]
