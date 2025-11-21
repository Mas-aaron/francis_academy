#!/usr/bin/env python
"""
Assign all courses to your instructor profile
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'francis_academy.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Instructor, Course

print("=" * 60)
print("ASSIGN COURSES TO INSTRUCTOR")
print("=" * 60)

# Get username
username = input("\nEnter your username: ").strip()

try:
    user = User.objects.get(username=username)
    print(f"\n✓ User found: {user.username}")
    
    # Check instructor profile
    if not hasattr(user, 'instructor_profile'):
        print("\n✗ ERROR: No instructor profile found!")
        print("\nCreate one first:")
        print("   python create_instructor.py")
        exit(1)
    
    instructor = user.instructor_profile
    print(f"✓ Instructor profile: {instructor.full_name}")
    
    # Get all courses
    all_courses = Course.objects.all()
    print(f"\n📚 Found {all_courses.count()} course(s)")
    
    if all_courses.count() == 0:
        print("\n✗ No courses found in database!")
        exit(1)
    
    print("\nCourses to assign:")
    for course in all_courses:
        current_instructor = course.instructor.full_name if course.instructor else "None"
        print(f"  • {course.title}")
        print(f"    Current instructor: {current_instructor}")
    
    # Ask for confirmation
    confirm = input(f"\nAssign ALL courses to {instructor.full_name}? (yes/no): ").strip().lower()
    
    if confirm == 'yes':
        updated_count = 0
        for course in all_courses:
            course.instructor = instructor
            course.save()
            updated_count += 1
            print(f"  ✓ Assigned: {course.title}")
        
        print(f"\n✅ SUCCESS! Assigned {updated_count} course(s) to {instructor.full_name}")
        print("\n🎉 You can now create quizzes for your courses!")
    else:
        print("\n✗ Cancelled. No changes made.")
        
except User.DoesNotExist:
    print(f"\n✗ ERROR: User '{username}' not found!")
    print("\nAvailable users:")
    for u in User.objects.all()[:10]:
        print(f"  • {u.username}")
except Exception as e:
    print(f"\n✗ ERROR: {str(e)}")
