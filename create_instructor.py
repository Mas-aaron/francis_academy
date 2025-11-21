#!/usr/bin/env python
"""
Script to create an Instructor profile for a user
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'francis_academy.settings')
django.setup()

from django.contrib.auth.models import User
from courses.models import Instructor

def create_instructor():
    print("=" * 50)
    print("CREATE INSTRUCTOR PROFILE")
    print("=" * 50)
    
    # Get username
    username = input("\nEnter username (e.g., Frncis): ").strip()
    
    # Check if user exists
    try:
        user = User.objects.get(username=username)
        print(f"✅ Found user: {user.username}")
    except User.DoesNotExist:
        print(f"❌ User '{username}' does not exist!")
        print("\nCreate a user first with: python manage.py createsuperuser")
        return
    
    # Check if already an instructor
    if hasattr(user, 'instructor'):
        print(f"⚠️  User '{username}' is already an instructor!")
        update = input("Update existing profile? (yes/no): ").lower()
        if update != 'yes':
            print("Cancelled.")
            return
        instructor = user.instructor
        print("Updating existing instructor profile...")
    else:
        instructor = Instructor(user=user)
        print("Creating new instructor profile...")
    
    # Get instructor details
    print("\n" + "-" * 50)
    print("INSTRUCTOR DETAILS")
    print("-" * 50)
    
    bio = input("Bio (e.g., Expert web developer): ").strip() or "Passionate educator and expert instructor"
    expertise = input("Expertise (e.g., Web Development, Python): ").strip() or "Web Development, Programming"
    years = input("Years of experience (e.g., 5): ").strip() or "5"
    
    # Update instructor
    instructor.bio = bio
    instructor.expertise = expertise
    instructor.years_experience = int(years)
    instructor.is_verified = True
    instructor.save()
    
    print("\n" + "=" * 50)
    print("✅ SUCCESS!")
    print("=" * 50)
    print(f"\nInstructor Profile Created:")
    print(f"  User: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Bio: {instructor.bio}")
    print(f"  Expertise: {instructor.expertise}")
    print(f"  Experience: {instructor.years_experience} years")
    print(f"  Verified: {instructor.is_verified}")
    print("\n" + "=" * 50)
    print("🚀 You can now access the instructor portal!")
    print("=" * 50)
    print(f"\nLogin and go to: http://localhost:8000/courses/instructor/")
    print("Or click your avatar → 'Instructor Dashboard'\n")

if __name__ == "__main__":
    create_instructor()
