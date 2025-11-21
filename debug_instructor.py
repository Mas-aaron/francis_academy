#!/usr/bin/env python
"""
Debug instructor profile issues
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'francis_academy.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Instructor

username = "Francis"

print("=" * 60)
print("DEBUGGING INSTRUCTOR PROFILE")
print("=" * 60)

try:
    user = User.objects.get(username=username)
    print(f"\n✓ User exists: {user.username} (ID: {user.id})")
    
    # Method 1: Check with hasattr
    has_profile = hasattr(user, 'instructor_profile')
    print(f"\nhasattr(user, 'instructor_profile'): {has_profile}")
    
    # Method 2: Direct query
    try:
        instructor = Instructor.objects.get(user=user)
        print(f"✓ Instructor found via query: {instructor.full_name}")
        print(f"  - ID: {instructor.id}")
        print(f"  - Expertise: {instructor.expertise}")
        print(f"  - User ID: {instructor.user.id}")
    except Instructor.DoesNotExist:
        print("✗ No Instructor found via query")
    
    # Method 3: Try to access directly
    try:
        profile = user.instructor_profile
        print(f"✓ Accessed via user.instructor_profile: {profile.full_name}")
    except Exception as e:
        print(f"✗ Error accessing user.instructor_profile: {e}")
    
    # Show all instructors
    print(f"\n📋 All Instructors in database:")
    all_instructors = Instructor.objects.all()
    for inst in all_instructors:
        print(f"  • {inst.full_name} (User: {inst.user.username}, ID: {inst.id})")
    
    # Check if multiple profiles exist for this user
    count = Instructor.objects.filter(user=user).count()
    print(f"\nInstructor profiles for '{username}': {count}")
    
    if count > 1:
        print("⚠️  WARNING: Multiple instructor profiles found! Deleting duplicates...")
        # Keep the first one, delete the rest
        instructors = list(Instructor.objects.filter(user=user))
        primary = instructors[0]
        for inst in instructors[1:]:
            print(f"   Deleting duplicate: {inst.id}")
            inst.delete()
        print(f"✓ Kept primary instructor: {primary.full_name}")
    
except User.DoesNotExist:
    print(f"✗ User '{username}' not found!")
except Exception as e:
    print(f"✗ Unexpected error: {e}")
    import traceback
    traceback.print_exc()
