#!/usr/bin/env python
"""
Quick script to check if your user has an instructor profile
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'francis_academy.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Instructor, Course

# Get your username (change this to your actual username)
username = input("Enter your username: ").strip()

try:
    user = User.objects.get(username=username)
    print(f"\n✓ User found: {user.username} (ID: {user.id})")
    
    # Check if has instructor profile
    if hasattr(user, 'instructor_profile'):
        instructor = user.instructor_profile
        print(f"✓ Instructor profile exists!")
        print(f"  - Name: {instructor.full_name}")
        print(f"  - Expertise: {instructor.expertise}")
        print(f"  - Verified: {instructor.is_verified}")
        
        # Check courses
        courses = Course.objects.filter(instructor=instructor)
        print(f"\n📚 Your courses ({courses.count()}):")
        for course in courses:
            print(f"  - {course.title} (slug: {course.slug})")
    else:
        print("✗ No instructor profile found!")
        print("\n🔧 To create one, run:")
        print("   python create_instructor.py")
        
except User.DoesNotExist:
    print(f"✗ User '{username}' not found!")
    print("\n📝 Available users:")
    for u in User.objects.all()[:10]:
        print(f"  - {u.username}")
