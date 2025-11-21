from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from .models import Certificate, Enrollment
import uuid
from datetime import datetime


def generate_certificate(enrollment):
    """Generate a certificate for completed course"""
    if enrollment.progress_percentage < 100:
        return None
    
    # Check if certificate already exists
    certificate, created = Certificate.objects.get_or_create(
        user=enrollment.user,
        course=enrollment.course,
        enrollment=enrollment
    )
    
    return certificate


def get_certificate_context(certificate):
    """Get context data for certificate template"""
    return {
        'certificate': certificate,
        'user': certificate.user,
        'course': certificate.course,
        'instructor': certificate.course.instructor,
        'issue_date': certificate.issued_at.strftime('%B %d, %Y'),
        'certificate_id': certificate.certificate_id,
    }


def create_certificate_pdf(certificate):
    """Create PDF certificate (placeholder - would use reportlab or similar)"""
    # This would generate a PDF certificate
    # For now, return HTML version
    context = get_certificate_context(certificate)
    html_content = render_to_string('courses/certificate.html', context)
    
    response = HttpResponse(html_content, content_type='text/html')
    response['Content-Disposition'] = f'inline; filename="certificate_{certificate.certificate_id}.html"'
    
    return response
