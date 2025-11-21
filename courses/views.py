from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count
from django.views.generic import ListView, DetailView
from django.views.decorators.http import require_POST
from .models import (Course, Category, Enrollment, Review, Wishlist, Lesson, LessonProgress,
                    Certificate, CourseNote, CourseBookmark, Discussion, DiscussionReply, Instructor, Notification,
                    Quiz, QuizQuestion, QuizChoice, QuizAttempt, QuizAnswer)
from .forms import ReviewForm, CourseForm, LessonForm, QuizForm, QuizQuestionForm, QuizChoiceFormSet
from .notifications import notify_discussion_reply, notify_new_discussion, create_notification
import os
from .certificate_utils import generate_certificate, create_certificate_pdf


class CourseListView(ListView):
    model = Course
    template_name = 'modern/course_list.html'
    context_object_name = 'courses'
    paginate_by = 12
    
    def get_queryset(self):
        queryset = Course.objects.filter(status='published').select_related('instructor', 'category')
        
        # Search functionality
        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(instructor__user__first_name__icontains=search_query) |
                Q(instructor__user__last_name__icontains=search_query)
            )
        
        # Category filter
        category_slug = self.request.GET.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Difficulty filter
        difficulty = self.request.GET.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Price filter
        price_filter = self.request.GET.get('price')
        if price_filter == 'free':
            queryset = queryset.filter(is_free=True)
        elif price_filter == 'paid':
            queryset = queryset.filter(is_free=False)
        
        # Sorting
        sort_by = self.request.GET.get('sort', 'newest')
        if sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort_by == 'price_low':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort_by == 'rating':
            queryset = queryset.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        elif sort_by == 'popular':
            queryset = queryset.annotate(student_count=Count('enrollments')).order_by('-student_count')
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        context['current_category'] = self.request.GET.get('category', '')
        context['current_difficulty'] = self.request.GET.get('difficulty', '')
        context['current_price'] = self.request.GET.get('price', '')
        context['current_sort'] = self.request.GET.get('sort', 'newest')
        context['search_query'] = self.request.GET.get('search', '')
        # Add enrollment status for current user so templates can show Continue Learning
        if self.request.user.is_authenticated:
            enrolled_ids = Enrollment.objects.filter(
                user=self.request.user,
                is_active=True,
                course__in=context['courses']
            ).values_list('course_id', flat=True)
            context['enrolled_course_ids'] = list(enrolled_ids)
        else:
            context['enrolled_course_ids'] = []
        return context


class CourseDetailView(DetailView):
    model = Course
    template_name = 'modern/course_detail.html'
    context_object_name = 'course'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'
    
    def get_queryset(self):
        return Course.objects.filter(status='published').select_related('instructor', 'category')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        course = self.get_object()
        
        # Check if user is enrolled
        is_enrolled = False
        enrollment = None
        if self.request.user.is_authenticated:
            try:
                enrollment = Enrollment.objects.get(user=self.request.user, course=course)
                is_enrolled = True
            except Enrollment.DoesNotExist:
                pass
        
        # Get course lessons
        lessons = course.lessons.all().order_by('order')
        
        # Get reviews
        reviews = course.reviews.all().order_by('-created_at')[:10]
        
        # Check if user can review (must be enrolled and not already reviewed)
        can_review = False
        if self.request.user.is_authenticated and is_enrolled:
            can_review = not Review.objects.filter(user=self.request.user, course=course).exists()
        
        # Check if in wishlist
        in_wishlist = False
        if self.request.user.is_authenticated:
            in_wishlist = Wishlist.objects.filter(user=self.request.user, course=course).exists()
        
        # Related courses
        related_courses = Course.objects.filter(
            category=course.category,
            status='published'
        ).exclude(id=course.id)[:4]
        
        context.update({
            'is_enrolled': is_enrolled,
            'enrollment': enrollment,
            'lessons': lessons,
            'reviews': reviews,
            'can_review': can_review,
            'in_wishlist': in_wishlist,
            'related_courses': related_courses,
            'review_form': ReviewForm(),
        })
        
        return context


def enroll_course(request, slug):
    course = get_object_or_404(Course, slug=slug, status='published')
    
    if request.user.is_authenticated:
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'is_active': True}
        )
        
        if created:
            messages.success(request, f'🎉 Successfully enrolled in {course.title}! Start learning now.')
        else:
            if enrollment.is_active:
                messages.info(request, 'You are already enrolled in this course.')
            else:
                enrollment.is_active = True
                enrollment.save()
                messages.success(request, f'🎉 Re-enrolled in {course.title}! Welcome back.')
        
        return redirect('courses:course_learn', slug=course.slug)
    else:
        # Redirect non-authenticated users to login
        messages.info(request, f'Please log in to enroll in {course.title}.')
        return redirect('login')


@login_required
def my_courses(request):
    enrollments = Enrollment.objects.filter(
        user=request.user,
        is_active=True
    ).select_related('course').order_by('-enrolled_at')
    
    return render(request, 'courses/my_courses.html', {
        'enrollments': enrollments
    })


def course_learn(request, slug):
    course = get_object_or_404(Course, slug=slug, status='published')
    
    enrollment = None
    lesson_progress = {}
    
    # Check if user is authenticated and enrolled
    if request.user.is_authenticated:
        try:
            enrollment = Enrollment.objects.get(user=request.user, course=course, is_active=True)
            
            # Get lesson progress for authenticated users
            lessons = course.lessons.select_related('quiz').all().order_by('order')
            for lesson in lessons:
                try:
                    progress = LessonProgress.objects.get(enrollment=enrollment, lesson=lesson)
                    lesson_progress[lesson.id] = progress.is_completed
                except LessonProgress.DoesNotExist:
                    lesson_progress[lesson.id] = False
        except Enrollment.DoesNotExist:
            # User is authenticated but not enrolled, show message
            messages.info(request, 'Register to track your progress and get certificates!')
    else:
        # Anonymous user - show message about registration benefits
        messages.info(request, 'Register to track your progress, save your place, and get certificates!')
    
    lessons = course.lessons.select_related('quiz').all().order_by('order')
    current_lesson = lessons.first()
    
    # Get lesson from URL parameter
    lesson_slug = request.GET.get('lesson')
    if lesson_slug:
        try:
            current_lesson = lessons.get(slug=lesson_slug)
        except Lesson.DoesNotExist:
            pass
    
    return render(request, 'courses/course_learn_coursera.html', {
        'course': course,
        'enrollment': enrollment,
        'lessons': lessons,
        'current_lesson': current_lesson,
        'lesson_progress': lesson_progress,
        'is_anonymous': not request.user.is_authenticated,
    })


@login_required
@require_POST
def mark_lesson_complete(request, slug, lesson_id):
    course = get_object_or_404(Course, slug=slug)
    lesson = get_object_or_404(Lesson, id=lesson_id, course=course)
    
    try:
        enrollment = Enrollment.objects.get(user=request.user, course=course, is_active=True)
    except Enrollment.DoesNotExist:
        return JsonResponse({'error': 'Not enrolled'}, status=403)
    
    progress, created = LessonProgress.objects.get_or_create(
        enrollment=enrollment,
        lesson=lesson,
        defaults={'is_completed': True}
    )
    
    if not created:
        progress.is_completed = not progress.is_completed
        progress.save()
    
    # Update enrollment progress
    total_lessons = course.lessons.count()
    completed_lessons = LessonProgress.objects.filter(
        enrollment=enrollment,
        is_completed=True
    ).count()
    
    enrollment.progress_percentage = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
    enrollment.save()
    
    return JsonResponse({
        'completed': progress.is_completed,
        'progress_percentage': enrollment.progress_percentage
    })


@login_required
@require_POST
def add_to_wishlist(request, slug):
    course = get_object_or_404(Course, slug=slug, status='published')
    
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        course=course
    )
    
    if created:
        return JsonResponse({'added': True, 'message': 'Added to wishlist'})
    else:
        wishlist_item.delete()
        return JsonResponse({'added': False, 'message': 'Removed from wishlist'})


@login_required
def wishlist(request):
    wishlist_items = Wishlist.objects.filter(user=request.user).select_related('course')
    return render(request, 'courses/wishlist.html', {
        'wishlist_items': wishlist_items
    })


@login_required
@require_POST
def add_review(request, slug):
    course = get_object_or_404(Course, slug=slug, status='published')
    
    # Check if user is enrolled
    try:
        Enrollment.objects.get(user=request.user, course=course, is_active=True)
    except Enrollment.DoesNotExist:
        messages.error(request, 'You must be enrolled to review this course.')
        return redirect('course_detail', slug=course.slug)
    
    # Check if user already reviewed
    if Review.objects.filter(user=request.user, course=course).exists():
        messages.error(request, 'You have already reviewed this course.')
        return redirect('course_detail', slug=course.slug)
    
    form = ReviewForm(request.POST)
    if form.is_valid():
        review = form.save(commit=False)
        review.user = request.user
        review.course = course
        review.save()
        messages.success(request, 'Thank you for your review!')
    else:
        messages.error(request, 'Please correct the errors in your review.')
    
    return redirect('course_detail', slug=course.slug)


def home(request):
    """Home page view with featured courses"""
    featured_courses = Course.objects.filter(
        status='published',
        is_featured=True
    ).select_related('instructor', 'category')[:6]
    
    # Add enrollment status for authenticated users
    if request.user.is_authenticated:
        user_enrollments = set(
            Enrollment.objects.filter(
                user=request.user,
                is_active=True,
                course__in=featured_courses
            ).values_list('course_id', flat=True)
        )
        
        for course in featured_courses:
            course.is_enrolled = course.id in user_enrollments
    else:
        for course in featured_courses:
            course.is_enrolled = False
    
    # Get categories with course counts
    categories = Category.objects.annotate(
        course_count=Count('courses', filter=Q(courses__status='published'))
    ).order_by('-course_count')[:8]
    
    # Get some stats
    total_courses = Course.objects.filter(status='published').count()
    total_students = Enrollment.objects.filter(is_active=True).values('user').distinct().count()
    total_instructors = Course.objects.filter(status='published').values('instructor').distinct().count()
    
    return render(request, 'modern/home.html', {
        'featured_courses': featured_courses,
        'categories': categories,
        'total_courses': total_courses,
        'total_students': total_students,
        'total_instructors': total_instructors,
    })


# Advanced Udemy/Coursera-like features

@login_required
def get_certificate(request, slug):
    """Generate and download certificate for completed course"""
    course = get_object_or_404(Course, slug=slug, status='published')
    
    try:
        enrollment = Enrollment.objects.get(user=request.user, course=course, is_active=True)
    except Enrollment.DoesNotExist:
        messages.error(request, 'You must be enrolled in this course.')
        return redirect('courses:course_detail', slug=course.slug)
    
    if enrollment.progress_percentage < 100:
        messages.error(request, 'You must complete the entire course to get a certificate.')
        return redirect('courses:course_learn', slug=course.slug)
    
    certificate = generate_certificate(enrollment)
    if certificate:
        return create_certificate_pdf(certificate)
    
    messages.error(request, 'Unable to generate certificate.')
    return redirect('courses:course_detail', slug=course.slug)


@login_required
@require_POST
def save_note(request, slug):
    """Save a note for a lesson"""
    course = get_object_or_404(Course, slug=slug)
    lesson_id = request.POST.get('lesson_id')
    content = request.POST.get('content', '').strip()
    timestamp = int(request.POST.get('timestamp', 0))
    
    if not content:
        return JsonResponse({'error': 'Note content is required'}, status=400)
    
    lesson = None
    if lesson_id:
        lesson = get_object_or_404(Lesson, id=lesson_id, course=course)
    
    note = CourseNote.objects.create(
        user=request.user,
        course=course,
        lesson=lesson,
        content=content,
        timestamp=timestamp
    )
    
    return JsonResponse({
        'id': note.id,
        'content': note.content,
        'timestamp': note.timestamp,
        'created_at': note.created_at.strftime('%Y-%m-%d %H:%M')
    })


@login_required
def get_notes(request, slug):
    """Get notes for a course"""
    course = get_object_or_404(Course, slug=slug)
    lesson_id = request.GET.get('lesson_id')
    
    notes = CourseNote.objects.filter(user=request.user, course=course)
    if lesson_id:
        notes = notes.filter(lesson_id=lesson_id)
    
    notes_data = [{
        'id': note.id,
        'content': note.content,
        'timestamp': note.timestamp,
        'lesson_title': note.lesson.title if note.lesson else 'General',
        'created_at': note.created_at.strftime('%Y-%m-%d %H:%M')
    } for note in notes]
    
    return JsonResponse({'notes': notes_data})


@login_required
@require_POST
def save_bookmark(request, slug):
    """Save a bookmark for a lesson"""
    course = get_object_or_404(Course, slug=slug)
    lesson_id = request.POST.get('lesson_id')
    title = request.POST.get('title', '').strip()
    timestamp = int(request.POST.get('timestamp', 0))
    
    if not lesson_id or not title:
        return JsonResponse({'error': 'Lesson and title are required'}, status=400)
    
    lesson = get_object_or_404(Lesson, id=lesson_id, course=course)
    
    bookmark, created = CourseBookmark.objects.get_or_create(
        user=request.user,
        lesson=lesson,
        timestamp=timestamp,
        defaults={'title': title}
    )
    
    return JsonResponse({
        'id': bookmark.id,
        'title': bookmark.title,
        'timestamp': bookmark.timestamp,
        'created': created
    })


@login_required
def get_discussions(request, slug):
    """Get discussions for a course"""
    course = get_object_or_404(Course, slug=slug)
    lesson_id = request.GET.get('lesson_id')
    
    discussions = Discussion.objects.filter(course=course)
    if lesson_id:
        discussions = discussions.filter(lesson_id=lesson_id)
    
    discussions_data = [{
        'id': discussion.id,
        'title': discussion.title,
        'content': discussion.content,
        'user': discussion.user.get_full_name() or discussion.user.username,
        'is_question': discussion.is_question,
        'is_resolved': discussion.is_resolved,
        'upvotes': discussion.upvotes,
        'replies_count': discussion.replies.count(),
        'created_at': discussion.created_at.strftime('%Y-%m-%d %H:%M')
    } for discussion in discussions]
    
    return JsonResponse({'discussions': discussions_data})


@login_required
@require_POST
def save_discussion(request, slug):
    """Save a new discussion/question"""
    course = get_object_or_404(Course, slug=slug)
    lesson_id = request.POST.get('lesson_id')
    title = request.POST.get('title', '').strip()
    content = request.POST.get('content', '').strip()
    is_question = request.POST.get('is_question', 'true').lower() == 'true'
    
    if not title or not content:
        return JsonResponse({'error': 'Title and content are required'}, status=400)
    
    lesson = None
    if lesson_id:
        lesson = get_object_or_404(Lesson, id=lesson_id, course=course)
    
    discussion = Discussion.objects.create(
        course=course,
        lesson=lesson,
        user=request.user,
        title=title,
        content=content,
        is_question=is_question
    )
    
    return JsonResponse({
        'id': discussion.id,
        'title': discussion.title,
        'content': discussion.content,
        'created_at': discussion.created_at.strftime('%Y-%m-%d %H:%M')
    })


@login_required
def student_dashboard(request):
    """Student dashboard with progress overview"""
    enrollments = Enrollment.objects.filter(
        user=request.user,
        is_active=True
    ).select_related('course', 'course__instructor', 'course__category').order_by('-enrolled_at')
    
    # Get courses in progress (not completed)
    continue_learning = enrollments.filter(progress_percentage__lt=100).order_by('-enrolled_at')[:3]
    
    # Get certificates
    certificates = Certificate.objects.filter(user=request.user).select_related('course')
    
    # Get recommended courses (from same categories as enrolled courses)
    enrolled_categories = enrollments.values_list('course__category', flat=True)
    if enrolled_categories:
        recommended_courses = Course.objects.filter(
            status='published',
            category__in=enrolled_categories
        ).exclude(
            id__in=enrollments.values_list('course_id', flat=True)
        ).annotate(
            avg_rating=Avg('reviews__rating')
        )[:3]
    else:
        # If no enrolled courses, recommend popular courses
        recommended_courses = Course.objects.filter(
            status='published',
            is_featured=True
        ).annotate(
            avg_rating=Avg('reviews__rating')
        )[:3]
    
    # Calculate stats
    enrolled_courses_count = enrollments.count()
    completed_courses_count = enrollments.filter(progress_percentage=100).count()
    certificates_count = certificates.count()
    
    return render(request, 'modern/student_dashboard.html', {
        'all_enrollments': enrollments,
        'continue_learning': continue_learning,
        'certificates': certificates,
        'recommended_courses': recommended_courses,
        'enrolled_courses_count': enrolled_courses_count,
        'completed_courses_count': completed_courses_count,
        'certificates_count': certificates_count,
    })


# ============================================
# INSTRUCTOR VIEWS
# ============================================

@login_required
def instructor_dashboard(request):
    """Instructor dashboard showing all their courses"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        messages.error(request, "You need to be an instructor to access this page.")
        return redirect('home')
    
    courses = Course.objects.filter(instructor=instructor).annotate(
        student_count=Count('enrollments', filter=Q(enrollments__is_active=True)),
        avg_rating=Avg('reviews__rating')
    ).order_by('-created_at')
    
    # Stats
    total_courses = courses.count()
    published_courses = courses.filter(status='published').count()
    total_students = Enrollment.objects.filter(course__instructor=instructor, is_active=True).values('user').distinct().count()
    total_revenue = sum([course.price * course.student_count for course in courses])
    
    context = {
        'courses': courses,
        'total_courses': total_courses,
        'published_courses': published_courses,
        'total_students': total_students,
        'total_revenue': total_revenue,
    }
    
    return render(request, 'instructor/dashboard.html', context)


@login_required
def instructor_course_create(request):
    """Create a new course"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        messages.error(request, "You need to be an instructor to create courses.")
        return redirect('home')
    
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        if form.is_valid():
            course = form.save(commit=False)
            course.instructor = instructor
            course.save()
            messages.success(request, f'Course "{course.title}" created successfully!')
            return redirect('courses:instructor_course_edit', slug=course.slug)
    else:
        form = CourseForm()
    
    return render(request, 'instructor/course_form.html', {
        'form': form,
        'title': 'Create New Course',
        'is_edit': False
    })


@login_required
def instructor_course_edit(request, slug):
    """Edit existing course"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        messages.error(request, "You need to be an instructor to edit courses.")
        return redirect('home')
    
    course = get_object_or_404(Course, slug=slug, instructor=instructor)
    lessons = course.lessons.all().order_by('order')
    
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES, instance=course)
        if form.is_valid():
            form.save()
            messages.success(request, f'Course "{course.title}" updated successfully!')
            return redirect('courses:instructor_course_edit', slug=course.slug)
    else:
        form = CourseForm(instance=course)
    
    return render(request, 'instructor/course_form.html', {
        'form': form,
        'course': course,
        'lessons': lessons,
        'title': f'Edit: {course.title}',
        'is_edit': True
    })


@login_required
def instructor_lesson_create(request, course_slug):
    """Create a new lesson for a course"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        messages.error(request, "You need to be an instructor to create lessons.")
        return redirect('home')
    
    course = get_object_or_404(Course, slug=course_slug, instructor=instructor)
    
    if request.method == 'POST':
        form = LessonForm(request.POST, request.FILES)
        if form.is_valid():
            lesson = form.save(commit=False)
            lesson.course = course
            
            # Handle video file upload
            video_file = request.FILES.get('video_file')
            if video_file:
                lesson.video_file = video_file
                # If video file is uploaded, use its URL
                lesson.video_url = ''
            
            lesson.save()
            messages.success(request, f'Lesson "{lesson.title}" created successfully!')
            return redirect('courses:instructor_course_edit', slug=course.slug)
    else:
        # Auto-set order to next available number
        next_order = course.lessons.count() + 1
        form = LessonForm(initial={'order': next_order})
    
    return render(request, 'instructor/lesson_form.html', {
        'form': form,
        'course': course,
        'title': f'Add Lesson to {course.title}',
        'is_edit': False
    })


@login_required
def instructor_lesson_edit(request, lesson_id):
    """Edit an existing lesson"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        messages.error(request, "You need to be an instructor to edit lessons.")
        return redirect('home')
    
    lesson = get_object_or_404(Lesson, id=lesson_id, course__instructor=instructor)
    course = lesson.course
    
    if request.method == 'POST':
        form = LessonForm(request.POST, request.FILES, instance=lesson)
        if form.is_valid():
            lesson = form.save(commit=False)
            
            # Handle video file upload
            video_file = request.FILES.get('video_file')
            if video_file:
                # Delete old video file if exists
                if lesson.video_file:
                    if os.path.isfile(lesson.video_file.path):
                        os.remove(lesson.video_file.path)
                lesson.video_file = video_file
                lesson.video_url = ''
            
            lesson.save()
            messages.success(request, f'Lesson "{lesson.title}" updated successfully!')
            return redirect('courses:instructor_course_edit', slug=course.slug)
    else:
        form = LessonForm(instance=lesson)
    
    return render(request, 'instructor/lesson_form.html', {
        'form': form,
        'course': course,
        'lesson': lesson,
        'title': f'Edit: {lesson.title}',
        'is_edit': True
    })


@login_required
@require_POST
def instructor_lesson_delete(request, lesson_id):
    """Delete a lesson"""
    try:
        instructor = request.user.instructor_profile
    except Instructor.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not authorized'})
    
    lesson = get_object_or_404(Lesson, id=lesson_id, course__instructor=instructor)
    course_slug = lesson.course.slug
    lesson_title = lesson.title
    
    # Delete video file if exists
    if lesson.video_file:
        if os.path.isfile(lesson.video_file.path):
            os.remove(lesson.video_file.path)
    
    lesson.delete()
    messages.success(request, f'Lesson "{lesson_title}" deleted successfully!')
    
    return JsonResponse({'success': True, 'redirect_url': f'/instructor/courses/{course_slug}/edit/'})


# ==================== QUIZ VIEWS ====================

@login_required
def instructor_quiz_create(request, course_slug, lesson_id):
    """Create a quiz for a lesson"""
    course = get_object_or_404(Course, slug=course_slug)
    lesson = get_object_or_404(Lesson, id=lesson_id, course=course)
    
    # Verify instructor owns this course
    if not hasattr(request.user, 'instructor_profile'):
        messages.error(request, "You need an instructor profile to create quizzes. Please contact admin.")
        return redirect('courses:instructor_dashboard')
    
    if course.instructor != request.user.instructor_profile:
        messages.error(request, f"You don't have permission to create quizzes for this course. This course belongs to {course.instructor.full_name}.")
        return redirect('courses:instructor_course_edit', slug=course_slug)
    
    # Check if quiz already exists
    if hasattr(lesson, 'quiz'):
        messages.info(request, 'This lesson already has a quiz. Edit it instead.')
        return redirect('courses:instructor_quiz_edit', course_slug=course_slug, quiz_id=lesson.quiz.id)
    
    if request.method == 'POST':
        form = QuizForm(request.POST)
        if form.is_valid():
            quiz = form.save(commit=False)
            quiz.lesson = lesson
            quiz.save()
            messages.success(request, f'Quiz "{quiz.title}" created successfully!')
            return redirect('courses:instructor_quiz_edit', course_slug=course_slug, quiz_id=quiz.id)
    else:
        form = QuizForm(initial={'title': f'{lesson.title} Quiz'})
    
    context = {
        'form': form,
        'course': course,
        'lesson': lesson
    }
    return render(request, 'instructor/quiz_form.html', context)


@login_required
def instructor_quiz_edit(request, course_slug, quiz_id):
    """Edit quiz and manage questions"""
    quiz = get_object_or_404(Quiz, id=quiz_id)
    course = quiz.lesson.course
    
    # Verify instructor owns this course
    if not hasattr(request.user, 'instructor_profile') or course.instructor != request.user.instructor_profile:
        messages.error(request, "You don't have permission to edit this quiz.")
        return redirect('courses:course_detail', slug=course_slug)
    
    if request.method == 'POST':
        form = QuizForm(request.POST, instance=quiz)
        if form.is_valid():
            form.save()
            messages.success(request, 'Quiz updated successfully!')
            return redirect('courses:instructor_quiz_edit', course_slug=course_slug, quiz_id=quiz.id)
    else:
        form = QuizForm(instance=quiz)
    
    questions = quiz.questions.all().order_by('order')
    
    context = {
        'form': form,
        'quiz': quiz,
        'course': course,
        'questions': questions
    }
    return render(request, 'instructor/quiz_edit.html', context)


@login_required
def instructor_question_create(request, course_slug, quiz_id):
    """Create a question for a quiz"""
    quiz = get_object_or_404(Quiz, id=quiz_id)
    course = quiz.lesson.course
    
    # Verify instructor owns this course
    if not hasattr(request.user, 'instructor_profile') or course.instructor != request.user.instructor_profile:
        messages.error(request, "You don't have permission to add questions to this quiz.")
        return redirect('courses:course_detail', slug=course_slug)
    
    if request.method == 'POST':
        form = QuizQuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.quiz = quiz
            question.save()
            messages.success(request, 'Question created successfully!')
            return redirect('courses:instructor_question_edit', course_slug=course_slug, question_id=question.id)
    else:
        # Auto-set order to be the next number
        next_order = quiz.questions.count()
        form = QuizQuestionForm(initial={'order': next_order})
    
    context = {
        'form': form,
        'quiz': quiz,
        'course': course
    }
    return render(request, 'instructor/question_form.html', context)


@login_required
def instructor_question_edit(request, course_slug, question_id):
    """Edit a question and its choices"""
    question = get_object_or_404(QuizQuestion, id=question_id)
    quiz = question.quiz
    course = quiz.lesson.course
    
    # Verify instructor owns this course
    if not hasattr(request.user, 'instructor_profile') or course.instructor != request.user.instructor_profile:
        messages.error(request, "You don't have permission to edit this question.")
        return redirect('courses:course_detail', slug=course_slug)
    
    if request.method == 'POST':
        form = QuizQuestionForm(request.POST, instance=question)
        
        # Only use formset for multiple choice and true/false questions
        if question.question_type in ['multiple_choice', 'true_false']:
            formset = QuizChoiceFormSet(request.POST, instance=question)
            if form.is_valid() and formset.is_valid():
                form.save()
                formset.save()
                messages.success(request, 'Question updated successfully!')
                return redirect('courses:instructor_quiz_edit', course_slug=course_slug, quiz_id=quiz.id)
        else:
            # Short answer - no formset needed
            if form.is_valid():
                form.save()
                messages.success(request, 'Question updated successfully!')
                return redirect('courses:instructor_quiz_edit', course_slug=course_slug, quiz_id=quiz.id)
            formset = None
    else:
        form = QuizQuestionForm(instance=question)
        # Only create formset for multiple choice and true/false
        if question.question_type in ['multiple_choice', 'true_false']:
            formset = QuizChoiceFormSet(instance=question)
        else:
            formset = None
    
    context = {
        'form': form,
        'formset': formset,
        'question': question,
        'quiz': quiz,
        'course': course
    }
    return render(request, 'instructor/question_edit.html', context)


@login_required
def instructor_question_delete(request, course_slug, question_id):
    """Delete a question"""
    question = get_object_or_404(QuizQuestion, id=question_id)
    quiz = question.quiz
    course = quiz.lesson.course
    
    # Verify instructor owns this course
    if not hasattr(request.user, 'instructor_profile') or course.instructor != request.user.instructor_profile:
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    if request.method == 'POST':
        question_text = question.question_text[:50]
        question.delete()
        messages.success(request, f'Question "{question_text}..." deleted successfully!')
        return JsonResponse({'success': True, 'redirect_url': f'/instructor/courses/{course_slug}/quiz/{quiz.id}/edit/'})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


# ==================== STUDENT QUIZ VIEWS ====================

@login_required
def quiz_take(request, course_slug, lesson_id):
    """Take a quiz"""
    lesson = get_object_or_404(Lesson, id=lesson_id, course__slug=course_slug)
    
    # Check enrollment
    enrollment = Enrollment.objects.filter(user=request.user, course=lesson.course, is_active=True).first()
    if not enrollment:
        messages.error(request, 'You must be enrolled in this course to take quizzes.')
        return redirect('courses:course_detail', slug=course_slug)
    
    # Check if lesson has a quiz
    if not hasattr(lesson, 'quiz'):
        messages.error(request, 'This lesson does not have a quiz.')
        return redirect('courses:course_learn', slug=course_slug, lesson_id=lesson_id)
    
    quiz = lesson.quiz
    
    # Create a new quiz attempt
    attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz)
    
    questions = quiz.questions.all().prefetch_related('choices')
    
    context = {
        'quiz': quiz,
        'attempt': attempt,
        'questions': questions,
        'course': lesson.course,
        'lesson': lesson
    }
    return render(request, 'courses/quiz_take.html', context)


@login_required
def quiz_submit(request, course_slug, attempt_id):
    """Submit quiz answers and show results"""
    from django.utils import timezone
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    quiz = attempt.quiz
    course = quiz.lesson.course
    
    if request.method == 'POST':
        # Get time taken from form
        time_taken = int(request.POST.get('time_taken', 0))
        attempt.time_taken_minutes = time_taken
        
        # Process each question answer
        for question in quiz.questions.all():
            if question.question_type == 'short_answer':
                # Short answer uses different field name
                answer_text = request.POST.get(f'question_{question.id}_text', '').strip()
                # Check if answer already exists
                existing_answer = QuizAnswer.objects.filter(attempt=attempt, question=question).first()
                if existing_answer:
                    # Update existing answer
                    existing_answer.answer_text = answer_text
                    existing_answer.is_correct = False  # Will be graded manually
                    existing_answer.save()
                else:
                    # Create new answer
                    QuizAnswer.objects.create(
                        attempt=attempt,
                        question=question,
                        answer_text=answer_text,
                        is_correct=False  # Will be graded manually
                    )
            else:
                # Multiple choice or True/False
                selected_choice_id = request.POST.get(f'question_{question.id}')
                if selected_choice_id:
                    selected_choice = QuizChoice.objects.get(id=selected_choice_id)
                    # Check if answer already exists
                    existing_answer = QuizAnswer.objects.filter(attempt=attempt, question=question).first()
                    if existing_answer:
                        # Update existing answer
                        existing_answer.selected_choice = selected_choice
                        existing_answer.is_correct = selected_choice.is_correct
                        existing_answer.save()
                    else:
                        # Create new answer
                        QuizAnswer.objects.create(
                            attempt=attempt,
                            question=question,
                            selected_choice=selected_choice,
                            is_correct=selected_choice.is_correct
                        )
        
        # Calculate score
        attempt.completed_at = timezone.now()
        attempt.calculate_score()
        
        messages.success(request, f'Quiz submitted! Your score: {attempt.score:.1f}%')
        return redirect('courses:quiz_results', course_slug=course.slug, attempt_id=attempt.id)
    
    return redirect('courses:quiz_take', course_slug=course.slug, lesson_id=quiz.lesson.id)


@login_required
def quiz_results(request, course_slug, attempt_id):
    """Show quiz results"""
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    quiz = attempt.quiz
    course = quiz.lesson.course
    
    answers = attempt.answers.all().select_related('question', 'selected_choice')
    
    # Get all questions with user's answers
    questions_with_answers = []
    for question in quiz.questions.all().prefetch_related('choices'):
        user_answer = answers.filter(question=question).first()
        questions_with_answers.append({
            'question': question,
            'user_answer': user_answer,
            'correct_choice': question.choices.filter(is_correct=True).first() if question.question_type != 'short_answer' else None
        })
    
    context = {
        'attempt': attempt,
        'quiz': quiz,
        'course': course,
        'answers': attempt.answers.all(),
        'correct_count': attempt.answers.filter(is_correct=True).count(),
        'total_questions': quiz.questions.count(),
    }
    return render(request, 'courses/quiz_result.html', context)


# Discussion Views
@login_required
def get_discussions(request, course_slug, lesson_id):
    """Get discussions for a lesson (AJAX)"""
    from .models import Discussion
    lesson = get_object_or_404(Lesson, id=lesson_id)
    discussions = lesson.discussions.all().select_related('user').prefetch_related('replies')
    
    discussions_data = []
    for discussion in discussions:
        discussions_data.append({
            'id': discussion.id,
            'title': discussion.title,
            'content': discussion.content,
            'user': discussion.user.get_full_name() or discussion.user.username,
            'created_at': discussion.created_at.strftime('%b %d, %Y at %I:%M %p'),
            'reply_count': discussion.reply_count(),
            'replies': [{
                'id': reply.id,
                'content': reply.content,
                'user': reply.user.get_full_name() or reply.user.username,
                'created_at': reply.created_at.strftime('%b %d, %Y at %I:%M %p'),
            } for reply in discussion.replies.all()]
        })
    
    return JsonResponse({'discussions': discussions_data})


@login_required
@require_POST
def create_discussion(request, course_slug, lesson_id):
    """Create a new discussion"""
    from .models import Discussion
    lesson = get_object_or_404(Lesson, id=lesson_id)
    course = lesson.course
    
    title = request.POST.get('title', '').strip()
    content = request.POST.get('content', '').strip()
    
    if not title or not content:
        return JsonResponse({'success': False, 'error': 'Title and content are required'}, status=400)
    
    discussion = Discussion.objects.create(
        course=course,
        lesson=lesson,
        user=request.user,
        title=title,
        content=content
    )
    
    # Send notifications for new discussion
    try:
        notify_new_discussion(discussion)
    except Exception as e:
        print(f"Error sending discussion notification: {e}")
    
    return JsonResponse({
        'success': True,
        'discussion': {
            'id': discussion.id,
            'title': discussion.title,
            'content': discussion.content,
            'user': request.user.get_full_name() or request.user.username,
            'created_at': discussion.created_at.strftime('%b %d, %Y at %I:%M %p'),
            'reply_count': 0,
            'replies': []
        }
    })


@login_required
@require_POST
def create_reply(request, course_slug, discussion_id):
    """Reply to a discussion"""
    from .models import Discussion, DiscussionReply
    discussion = get_object_or_404(Discussion, id=discussion_id)
    
    content = request.POST.get('content', '').strip()
    
    if not content:
        return JsonResponse({'success': False, 'error': 'Reply content is required'}, status=400)
    
    reply = DiscussionReply.objects.create(
        discussion=discussion,
        user=request.user,
        content=content
    )
    
    # Send notifications for new reply
    try:
        notify_discussion_reply(reply)
    except Exception as e:
        print(f"Error sending reply notification: {e}")
    
    return JsonResponse({
        'success': True,
        'reply': {
            'id': reply.id,
            'content': reply.content,
            'user': request.user.get_full_name() or request.user.username,
            'created_at': reply.created_at.strftime('%b %d, %Y at %I:%M %p'),
        }
    })


@login_required
def get_notifications(request):
    """Get user notifications (AJAX)"""
    from .notifications import get_recent_notifications, get_unread_notifications_count
    
    notifications = get_recent_notifications(request.user, limit=20)
    unread_count = get_unread_notifications_count(request.user)
    
    notifications_data = [{
        'id': notif.id,
        'type': notif.notification_type,
        'title': notif.title,
        'message': notif.message,
        'is_read': notif.is_read,
        'created_at': notif.created_at.strftime('%b %d, %Y at %I:%M %p'),
        'action_url': notif.action_url,
        'time_ago': get_time_ago(notif.created_at)
    } for notif in notifications]
    
    return JsonResponse({
        'notifications': notifications_data,
        'unread_count': unread_count
    })


@login_required
@require_POST
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.mark_as_read()
        return JsonResponse({'success': True})
    except Notification.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Notification not found'}, status=404)


@login_required
@require_POST
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    from .notifications import mark_notifications_as_read
    
    count = mark_notifications_as_read(request.user)
    return JsonResponse({'success': True, 'marked_count': count})


def get_time_ago(datetime_obj):
    """Helper function to get human-readable time ago"""
    from django.utils import timezone
    import datetime as dt
    
    now = timezone.now()
    diff = now - datetime_obj
    
    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "Just now"


# Instructor Analytics Views
@login_required
def instructor_course_discussions(request, slug):
    """View all discussions for a course"""
    try:
        instructor = request.user.instructor_profile
    except:
        messages.error(request, "You must be an instructor to access this page.")
        return redirect('courses:course_list')
    
    course = get_object_or_404(Course, slug=slug, instructor=instructor)
    from .models import Discussion
    
    # Get all discussions for this course
    discussions = Discussion.objects.filter(course=course).select_related('user', 'lesson').prefetch_related('replies__user').order_by('-created_at')
    
    context = {
        'course': course,
        'discussions': discussions,
    }
    return render(request, 'instructor/course_discussions.html', context)


@login_required
def instructor_quiz_results(request, slug):
    """View all quiz attempts for a course"""
    try:
        instructor = request.user.instructor_profile
    except:
        messages.error(request, "You must be an instructor to access this page.")
        return redirect('courses:course_list')
    
    course = get_object_or_404(Course, slug=slug, instructor=instructor)
    
    # Get all quizzes for this course
    quizzes = Quiz.objects.filter(lesson__course=course).prefetch_related(
        'attempts__user',
        'attempts__answers'
    ).order_by('lesson__order')
    
    # Get all attempts with student info
    attempts = QuizAttempt.objects.filter(
        quiz__lesson__course=course
    ).select_related('user', 'quiz', 'quiz__lesson').order_by('-completed_at')
    
    context = {
        'course': course,
        'quizzes': quizzes,
        'attempts': attempts,
    }
    return render(request, 'instructor/quiz_results.html', context)


@login_required
def instructor_grade_short_answer(request, slug, attempt_id):
    """Grade short answer questions"""
    try:
        instructor = request.user.instructor_profile
    except:
        messages.error(request, "You must be an instructor to access this page.")
        return redirect('courses:course_list')
    
    course = get_object_or_404(Course, slug=slug, instructor=instructor)
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, quiz__lesson__course=course)
    
    if request.method == 'POST':
        # Grade each short answer
        for key, value in request.POST.items():
            if key.startswith('answer_'):
                answer_id = key.replace('answer_', '')
                is_correct = value == 'correct'
                
                try:
                    answer = QuizAnswer.objects.get(id=answer_id, attempt=attempt)
                    answer.is_correct = is_correct
                    answer.save()
                except QuizAnswer.DoesNotExist:
                    pass
        
        # Recalculate score
        attempt.calculate_score()
        messages.success(request, 'Grades updated successfully!')
        return redirect('courses:instructor_quiz_results', slug=slug)
    
    # Get short answer questions
    short_answers = attempt.answers.filter(
        question__question_type='short_answer'
    ).select_related('question')
    
    context = {
        'course': course,
        'attempt': attempt,
        'short_answers': short_answers,
    }
    return render(request, 'instructor/grade_short_answer.html', context)


# Notes Views
@login_required
def get_notes(request, course_slug, lesson_id):
    """Get all notes for a lesson"""
    from .models import CourseNote
    lesson = get_object_or_404(Lesson, id=lesson_id)
    
    notes = CourseNote.objects.filter(
        user=request.user,
        lesson=lesson
    ).order_by('-created_at')
    
    notes_data = [{
        'id': note.id,
        'content': note.content,
        'timestamp': note.timestamp,
        'created_at': note.created_at.strftime('%b %d, %Y at %I:%M %p'),
    } for note in notes]
    
    return JsonResponse({'notes': notes_data})


@login_required
@require_POST
def create_note(request, course_slug, lesson_id):
    """Create a new note"""
    from .models import CourseNote
    lesson = get_object_or_404(Lesson, id=lesson_id)
    course = lesson.course
    
    content = request.POST.get('content', '').strip()
    timestamp = request.POST.get('timestamp', 0)
    
    if not content:
        return JsonResponse({'success': False, 'error': 'Content is required'}, status=400)
    
    note = CourseNote.objects.create(
        user=request.user,
        course=course,
        lesson=lesson,
        content=content,
        timestamp=int(timestamp)
    )
    
    return JsonResponse({
        'success': True,
        'note': {
            'id': note.id,
            'content': note.content,
            'timestamp': note.timestamp,
            'created_at': note.created_at.strftime('%b %d, %Y at %I:%M %p'),
        }
    })


@login_required
@require_POST
def delete_note(request, course_slug, note_id):
    """Delete a note"""
    from .models import CourseNote
    note = get_object_or_404(CourseNote, id=note_id, user=request.user)
    note.delete()
    
    return JsonResponse({'success': True})


# About Us and Contact Us Views
def about_view(request):
    """About Us page view"""
    return render(request, 'modern/about.html')


def contact_view(request):
    """Contact Us page view with form handling"""
    if request.method == 'POST':
        # Handle contact form submission
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        inquiry_type = request.POST.get('inquiry_type')
        message = request.POST.get('message')
        
        # Here you can add logic to save the contact form data to database
        # or send an email notification
        
        # For now, we'll just return a success response
        return JsonResponse({
            'success': True,
            'message': 'Thank you for your message! We will get back to you within 24 hours.'
        })
    
    return render(request, 'modern/contact.html')
