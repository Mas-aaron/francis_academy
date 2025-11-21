"""
URL configuration for francis_academy project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import JsonResponse
from courses.models import Category
from courses.views import home, CourseListView, CourseDetailView, student_dashboard, about_view, contact_view
from courses.auth_views import signup_view, login_view, logout_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('dashboard/', student_dashboard, name='student_dashboard'),
    path('debug/categories/', lambda request: JsonResponse({
        'categories': [
            {
                'name': cat.name, 
                'course_count': cat.courses.filter(status='published').count()
            } 
            for cat in Category.objects.all()
        ]
    }), name='debug_categories'),
    path('courses/', include(('courses.urls', 'courses'), namespace='courses')),
    path('modern/courses/', CourseListView.as_view(template_name='modern/course_list.html'), name='modern_course_list'),
    path('course/<slug:slug>/', CourseDetailView.as_view(template_name='modern/course_detail.html'), name='course_detail'),
    
    # About and Contact pages
    path('about/', about_view, name='about'),
    path('contact/', contact_view, name='contact'),
    
    # Authentication
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Redirect old URLs to new ones
    path('home/', RedirectView.as_view(url='/', permanent=True)),
    path('index.html', RedirectView.as_view(url='/', permanent=True)),
    
    # Uncomment these when ready
    # path('accounts/', include('allauth.urls')),
    # path('api/', include('api.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        pass
