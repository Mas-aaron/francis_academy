from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    # Course listing and detail
    path('', views.CourseListView.as_view(), name='course_list'),
    path('course/<slug:slug>/', views.CourseDetailView.as_view(), name='course_detail'),
    
    # Enrollment
    path('course/<slug:slug>/enroll/', views.enroll_course, name='enroll_course'),
    path('my-courses/', views.my_courses, name='my_courses'),
    
    # Learning
    path('course/<slug:slug>/learn/', views.course_learn, name='course_learn'),
    path('course/<slug:slug>/lesson/<int:lesson_id>/complete/', views.mark_lesson_complete, name='mark_lesson_complete'),
    
    # Wishlist
    path('course/<slug:slug>/wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/', views.wishlist, name='wishlist'),
    
    # Reviews
    path('course/<slug:slug>/review/', views.add_review, name='add_review'),
    
    # Advanced Features (Udemy/Coursera-like)
    path('course/<slug:slug>/certificate/', views.get_certificate, name='get_certificate'),
    path('course/<slug:slug>/notes/', views.get_notes, name='get_notes'),
    path('course/<slug:slug>/notes/save/', views.save_note, name='save_note'),
    path('course/<slug:slug>/bookmarks/save/', views.save_bookmark, name='save_bookmark'),
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
    
    # Discussions
    path('course/<slug:course_slug>/lesson/<int:lesson_id>/discussions/', views.get_discussions, name='get_discussions'),
    path('course/<slug:course_slug>/lesson/<int:lesson_id>/discussions/create/', views.create_discussion, name='create_discussion'),
    path('course/<slug:course_slug>/discussion/<int:discussion_id>/reply/', views.create_reply, name='create_reply'),
    
    # Notifications
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    
    # Notes
    path('course/<slug:course_slug>/lesson/<int:lesson_id>/notes/', views.get_notes, name='get_notes'),
    path('course/<slug:course_slug>/lesson/<int:lesson_id>/notes/create/', views.create_note, name='create_note'),
    path('course/<slug:course_slug>/note/<int:note_id>/delete/', views.delete_note, name='delete_note'),
    
    # Instructor Portal
    path('instructor/', views.instructor_dashboard, name='instructor_dashboard'),
    path('instructor/courses/create/', views.instructor_course_create, name='instructor_course_create'),
    path('instructor/courses/<slug:slug>/edit/', views.instructor_course_edit, name='instructor_course_edit'),
    path('instructor/courses/<slug:course_slug>/lessons/create/', views.instructor_lesson_create, name='instructor_lesson_create'),
    path('instructor/lessons/<int:lesson_id>/edit/', views.instructor_lesson_edit, name='instructor_lesson_edit'),
    path('instructor/lessons/<int:lesson_id>/delete/', views.instructor_lesson_delete, name='instructor_lesson_delete'),
    
    # Instructor Analytics
    path('instructor/courses/<slug:slug>/discussions/', views.instructor_course_discussions, name='instructor_course_discussions'),
    path('instructor/courses/<slug:slug>/quiz-results/', views.instructor_quiz_results, name='instructor_quiz_results'),
    path('instructor/courses/<slug:slug>/grade/<int:attempt_id>/', views.instructor_grade_short_answer, name='instructor_grade_short_answer'),
    
    # Quiz Management (Instructor)
    path('instructor/courses/<slug:course_slug>/lessons/<int:lesson_id>/quiz/create/', views.instructor_quiz_create, name='instructor_quiz_create'),
    path('instructor/courses/<slug:course_slug>/quiz/<int:quiz_id>/edit/', views.instructor_quiz_edit, name='instructor_quiz_edit'),
    path('instructor/courses/<slug:course_slug>/quiz/<int:quiz_id>/questions/create/', views.instructor_question_create, name='instructor_question_create'),
    path('instructor/courses/<slug:course_slug>/questions/<int:question_id>/edit/', views.instructor_question_edit, name='instructor_question_edit'),
    path('instructor/courses/<slug:course_slug>/questions/<int:question_id>/delete/', views.instructor_question_delete, name='instructor_question_delete'),
    
    # Quiz Taking (Student)
    path('course/<slug:course_slug>/lesson/<int:lesson_id>/quiz/', views.quiz_take, name='quiz_take'),
    path('course/<slug:course_slug>/quiz/attempt/<int:attempt_id>/submit/', views.quiz_submit, name='quiz_submit'),
    path('course/<slug:course_slug>/quiz/attempt/<int:attempt_id>/results/', views.quiz_results, name='quiz_results'),
]
