"""
Notification utilities for Francis Academy
"""
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Notification, Discussion, DiscussionReply, Course, Enrollment


def create_notification(user, notification_type, title, message, **kwargs):
    """
    Create a new notification for a user
    """
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        course=kwargs.get('course'),
        discussion=kwargs.get('discussion'),
        discussion_reply=kwargs.get('discussion_reply'),
        action_url=kwargs.get('action_url')
    )
    return notification


def notify_discussion_reply(discussion_reply):
    """
    Notify users when someone replies to a discussion
    """
    discussion = discussion_reply.discussion
    course = discussion.course
    
    # Get all users who should be notified
    users_to_notify = set()
    
    # 1. Notify the discussion author (if not the same as reply author)
    if discussion.user != discussion_reply.user:
        users_to_notify.add(discussion.user)
    
    # 2. Notify all users who have replied to this discussion (except the current reply author)
    previous_repliers = DiscussionReply.objects.filter(
        discussion=discussion
    ).exclude(user=discussion_reply.user).values_list('user', flat=True)
    
    for user_id in previous_repliers:
        try:
            user = User.objects.get(id=user_id)
            users_to_notify.add(user)
        except User.DoesNotExist:
            continue
    
    # 3. Notify course instructor if they're not the reply author
    if hasattr(course, 'instructor') and course.instructor.user != discussion_reply.user:
        users_to_notify.add(course.instructor.user)
    
    # Create notifications
    action_url = f"/courses/course/{course.slug}/learn/?discussion={discussion.id}"
    
    for user in users_to_notify:
        # Check if user is enrolled in the course
        if Enrollment.objects.filter(user=user, course=course, is_active=True).exists():
            create_notification(
                user=user,
                notification_type='discussion_reply',
                title=f'New reply in "{discussion.title}"',
                message=f'{discussion_reply.user.get_full_name() or discussion_reply.user.username} replied to the discussion "{discussion.title}" in {course.title}',
                course=course,
                discussion=discussion,
                discussion_reply=discussion_reply,
                action_url=action_url
            )


def notify_new_discussion(discussion):
    """
    Notify course instructor and enrolled students about new discussion
    """
    course = discussion.course
    
    # Get all enrolled users (except the discussion author)
    enrolled_users = User.objects.filter(
        enrollments__course=course,
        enrollments__is_active=True
    ).exclude(id=discussion.user.id)
    
    action_url = f"/courses/course/{course.slug}/learn/?discussion={discussion.id}"
    
    # Notify instructor
    if hasattr(course, 'instructor') and course.instructor.user != discussion.user:
        create_notification(
            user=course.instructor.user,
            notification_type='discussion_new',
            title=f'New discussion: "{discussion.title}"',
            message=f'{discussion.user.get_full_name() or discussion.user.username} started a new discussion in {course.title}',
            course=course,
            discussion=discussion,
            action_url=action_url
        )
    
    # Optionally notify other students (you might want to make this configurable)
    # For now, let's only notify if it's a question that needs help
    if discussion.is_question:
        for user in enrolled_users[:10]:  # Limit to first 10 to avoid spam
            create_notification(
                user=user,
                notification_type='discussion_new',
                title=f'New question: "{discussion.title}"',
                message=f'{discussion.user.get_full_name() or discussion.user.username} asked a question in {course.title}',
                course=course,
                discussion=discussion,
                action_url=action_url
            )


def notify_course_announcement(announcement):
    """
    Notify all enrolled students about course announcements
    """
    course = announcement.course
    
    # Get all enrolled users
    enrolled_users = User.objects.filter(
        enrollments__course=course,
        enrollments__is_active=True
    )
    
    action_url = f"/courses/course/{course.slug}/learn/"
    
    for user in enrolled_users:
        create_notification(
            user=user,
            notification_type='course_announcement',
            title=f'New announcement: {announcement.title}',
            message=f'New announcement in {course.title}: {announcement.content[:100]}...',
            course=course,
            action_url=action_url
        )


def get_unread_notifications_count(user):
    """
    Get count of unread notifications for a user
    """
    return Notification.objects.filter(user=user, is_read=False).count()


def get_recent_notifications(user, limit=10):
    """
    Get recent notifications for a user
    """
    return Notification.objects.filter(user=user).order_by('-created_at')[:limit]


def mark_notifications_as_read(user, notification_ids=None):
    """
    Mark notifications as read
    """
    queryset = Notification.objects.filter(user=user, is_read=False)
    
    if notification_ids:
        queryset = queryset.filter(id__in=notification_ids)
    
    queryset.update(is_read=True)
    return queryset.count()
