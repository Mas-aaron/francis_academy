FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose a default port; Railway will still inject $PORT
EXPOSE 8080

# Run the application and bind to Railway's PORT if provided
CMD sh -c "gunicorn francis_academy.wsgi:application --bind 0.0.0.0:${PORT:-8080}"
