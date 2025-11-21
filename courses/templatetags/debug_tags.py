from django import template
from django.db.models import Count, Q
from courses.models import Category, Course

register = template.Library()

@register.simple_tag
def get_category_course_count(category):
    """Get the number of published courses for a category"""
    return Course.objects.filter(category=category, status='published').count()

@register.simple_tag
def debug_categories():
    """Debug helper to show category information"""
    categories = Category.objects.annotate(
        course_count=Count('courses', filter=Q(courses__status='published'))
    )
    
    debug_info = []
    for cat in categories:
        debug_info.append({
            'name': cat.name,
            'slug': cat.slug,
            'course_count': cat.course_count,
            'total_courses': cat.courses.count(),
            'published_courses': cat.courses.filter(status='published').count()
        })
    
    return debug_info
