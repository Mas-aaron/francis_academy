from django.contrib import admin
from django.utils.html import format_html
from .models import (Category, Instructor, Course, Lesson, Enrollment, LessonProgress, Review, Wishlist,
                     Quiz, QuizQuestion, QuizChoice, QuizAttempt, QuizAnswer, Discussion, DiscussionReply, Notification)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'course_count', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    
    def course_count(self, obj):
        return obj.courses.count()
    course_count.short_description = 'Courses'


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['user_info', 'full_name', 'expertise', 'years_experience', 'is_verified', 'course_count']
    list_filter = ['is_verified', 'years_experience', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'user__email', 'expertise']
    list_editable = ['is_verified']
    readonly_fields = ['created_at', 'user_email']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'user_email')
        }),
        ('Professional Details', {
            'fields': ('bio', 'expertise', 'years_experience')
        }),
        ('Media', {
            'fields': ('profile_image',)
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'twitter_url', 'website_url'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_verified', 'created_at')
        }),
    )
    
    def user_info(self, obj):
        return format_html(
            '<strong>{}</strong><br><small style="color: #666;">{}</small>',
            obj.user.username,
            obj.user.email
        )
    user_info.short_description = 'User Account'
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'
    
    def course_count(self, obj):
        count = obj.courses.count()
        if count > 0:
            return format_html(
                '<a href="/admin/courses/course/?instructor__id__exact={}">{} course(s)</a>',
                obj.id,
                count
            )
        return '0 courses'
    course_count.short_description = 'Courses'
    
    actions = ['verify_instructors', 'unverify_instructors']
    
    def verify_instructors(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} instructor(s) verified.')
    verify_instructors.short_description = 'Verify selected instructors'
    
    def unverify_instructors(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} instructor(s) unverified.')
    unverify_instructors.short_description = 'Unverify selected instructors'


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'lesson_type', 'duration_minutes', 'order', 'is_preview']
    ordering = ['order']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor_info', 'category', 'price', 'difficulty', 'status', 'is_featured', 'total_students', 'created_at']
    list_filter = ['status', 'difficulty', 'category', 'is_featured', 'is_bestseller', 'instructor', 'created_at']
    search_fields = ['title', 'description', 'instructor__user__first_name', 'instructor__user__last_name', 'instructor__user__username']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline]
    list_select_related = ['instructor', 'instructor__user', 'category']
    
    def instructor_info(self, obj):
        if obj.instructor:
            return format_html(
                '<strong>{}</strong><br><small style="color: #666;">{}</small>',
                obj.instructor.full_name,
                obj.instructor.user.username
            )
        return '-'
    instructor_info.short_description = 'Instructor'
    instructor_info.admin_order_field = 'instructor__user__username'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'short_description', 'category', 'instructor')
        }),
        ('Media', {
            'fields': ('thumbnail', 'preview_video')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'is_free')
        }),
        ('Course Details', {
            'fields': ('difficulty', 'duration_hours', 'language')
        }),
        ('Status & Features', {
            'fields': ('status', 'is_featured', 'is_bestseller')
        }),
        ('SEO', {
            'fields': ('meta_description', 'keywords'),
            'classes': ('collapse',)
        })
    )
    
    def total_students(self, obj):
        return obj.total_students
    total_students.short_description = 'Students'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_type', 'duration_minutes', 'order', 'is_preview']
    list_filter = ['lesson_type', 'is_preview', 'course__category']
    search_fields = ['title', 'course__title']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'progress_percentage', 'is_active', 'enrolled_at', 'completed_at']
    list_filter = ['is_active', 'enrolled_at', 'course__category']
    search_fields = ['user__username', 'user__email', 'course__title']
    readonly_fields = ['enrolled_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['course', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'course__category']
    search_fields = ['course__title', 'user__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'added_at']
    list_filter = ['added_at', 'course__category']
    search_fields = ['user__username', 'course__title']


# ==================== QUIZ ADMIN ====================

class QuizChoiceInline(admin.TabularInline):
    model = QuizChoice
    extra = 4
    fields = ['choice_text', 'is_correct', 'order']
    ordering = ['order']


class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1
    fields = ['question_text', 'question_type', 'points', 'order']
    ordering = ['order']
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'passing_score', 'time_limit', 'question_count', 'attempt_count']
    list_filter = ['lesson__course__category', 'passing_score']
    search_fields = ['title', 'description', 'lesson__title']
    inlines = [QuizQuestionInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('lesson', 'title', 'description')
        }),
        ('Settings', {
            'fields': ('passing_score', 'time_limit')
        }),
    )
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'
    
    def attempt_count(self, obj):
        return obj.attempts.count()
    attempt_count.short_description = 'Attempts'


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text_short', 'quiz', 'question_type', 'points', 'order', 'choice_count']
    list_filter = ['question_type', 'quiz__lesson__course']
    search_fields = ['question_text', 'quiz__title']
    inlines = [QuizChoiceInline]
    
    fieldsets = (
        ('Question', {
            'fields': ('quiz', 'question_text', 'question_type')
        }),
        ('Settings', {
            'fields': ('points', 'order')
        }),
    )
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = 'Question'
    
    def choice_count(self, obj):
        return obj.choices.count()
    choice_count.short_description = 'Choices'


@admin.register(QuizChoice)
class QuizChoiceAdmin(admin.ModelAdmin):
    list_display = ['choice_text', 'question_short', 'is_correct', 'order']
    list_filter = ['is_correct', 'question__quiz']
    search_fields = ['choice_text', 'question__question_text']
    
    def question_short(self, obj):
        return obj.question.question_text[:30] + '...'
    question_short.short_description = 'Question'


class QuizAnswerInline(admin.TabularInline):
    model = QuizAnswer
    extra = 0
    fields = ['question', 'selected_choice', 'answer_text', 'is_correct']
    readonly_fields = ['question', 'selected_choice', 'answer_text', 'is_correct']
    can_delete = False


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'passed', 'time_taken_minutes', 'started_at', 'completed_at']
    list_filter = ['passed', 'quiz__lesson__course', 'started_at']
    search_fields = ['user__username', 'quiz__title']
    readonly_fields = ['started_at', 'completed_at', 'score', 'passed']
    inlines = [QuizAnswerInline]
    
    fieldsets = (
        ('Attempt Info', {
            'fields': ('user', 'quiz', 'started_at', 'completed_at')
        }),
        ('Results', {
            'fields': ('score', 'passed', 'time_taken_minutes')
        }),
    )
    
    def has_add_permission(self, request):
        return False


@admin.register(QuizAnswer)
class QuizAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'question_short', 'selected_choice', 'is_correct']
    list_filter = ['is_correct', 'attempt__quiz']
    search_fields = ['attempt__user__username', 'question__question_text']
    readonly_fields = ['attempt', 'question', 'selected_choice', 'answer_text', 'is_correct']
    
    def question_short(self, obj):
        return obj.question.question_text[:40] + '...'
    question_short.short_description = 'Question'
    
    def has_add_permission(self, request):
        return False


# ==================== DISCUSSION ADMIN ====================

class DiscussionReplyInline(admin.TabularInline):
    model = DiscussionReply
    extra = 0
    fields = ['user', 'content', 'created_at']
    readonly_fields = ['created_at']


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'user', 'reply_count', 'created_at']
    list_filter = ['lesson__course', 'created_at']
    search_fields = ['title', 'content', 'user__username', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [DiscussionReplyInline]
    
    fieldsets = (
        ('Discussion', {
            'fields': ('lesson', 'user', 'title', 'content')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(DiscussionReply)
class DiscussionReplyAdmin(admin.ModelAdmin):
    list_display = ['discussion_title', 'user', 'content_short', 'created_at']
    list_filter = ['discussion__lesson__course', 'created_at']
    search_fields = ['content', 'user__username', 'discussion__title']
    readonly_fields = ['created_at', 'updated_at']
    
    def discussion_title(self, obj):
        return obj.discussion.title[:40] + '...' if len(obj.discussion.title) > 40 else obj.discussion.title
    discussion_title.short_description = 'Discussion'
    
    def content_short(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_short.short_description = 'Reply'


# ==================== NOTIFICATION ADMIN ====================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__username', 'user__email']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('user', 'notification_type', 'title', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'created_at')
        }),
        ('Related Objects', {
            'fields': ('course', 'discussion', 'discussion_reply', 'action_url'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notification(s) marked as read.')
    mark_as_read.short_description = 'Mark selected notifications as read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notification(s) marked as unread.')
    mark_as_unread.short_description = 'Mark selected notifications as unread'
