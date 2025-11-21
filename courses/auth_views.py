"""
Authentication views for Francis Academy
Handles student signup, login, and authentication flow
"""
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib import messages
from django.db import IntegrityError
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET", "POST"])
def signup_view(request):
    """
    Handle student registration/signup
    """
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        # Get form data
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        # Validation
        errors = []
        
        if not username or len(username) < 3:
            errors.append('Username must be at least 3 characters long')
        
        if not email or '@' not in email:
            errors.append('Please provide a valid email address')
        
        if not password1 or len(password1) < 8:
            errors.append('Password must be at least 8 characters long')
        
        if password1 != password2:
            errors.append('Passwords do not match')
        
        if not first_name:
            errors.append('First name is required')
        
        if not last_name:
            errors.append('Last name is required')
        
        # Check if username exists
        if User.objects.filter(username=username).exists():
            errors.append('Username already exists')
        
        # Check if email exists
        if User.objects.filter(email=email).exists():
            errors.append('Email already registered')
        
        if errors:
            for error in errors:
                messages.error(request, error)
            return render(request, 'modern/signup.html', {
                'form': request.POST,
            })
        
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name
            )
            
            # Log the user in
            login(request, user)
            
            messages.success(request, f'🎉 Welcome to Francis Academy, {first_name}! Your account has been created successfully.')
            
            # Redirect to next page or dashboard
            next_url = request.GET.get('next') or request.POST.get('next')
            if next_url:
                return redirect(next_url)
            
            return redirect('student_dashboard')
            
        except IntegrityError:
            messages.error(request, 'An error occurred during registration. Please try again.')
            return render(request, 'modern/signup.html', {
                'form': request.POST,
            })
        except Exception as e:
            messages.error(request, f'An unexpected error occurred: {str(e)}')
            return render(request, 'modern/signup.html', {
                'form': request.POST,
            })
    
    return render(request, 'modern/signup.html')


@require_http_methods(["GET", "POST"])
def login_view(request):
    """
    Handle user login
    """
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        
        if not username or not password:
            messages.error(request, 'Please provide both username/email and password')
            return render(request, 'modern/login.html', {
                'form': request.POST,
                'next': request.POST.get('next') or request.GET.get('next')
            })
        
        # Try to authenticate with username
        user = authenticate(request, username=username, password=password)
        
        # If that fails, try with email
        if user is None and '@' in username:
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        
        if user is not None:
            login(request, user)
            
            # Set session expiry
            if not remember:
                request.session.set_expiry(0)  # Expires when browser closes
            else:
                request.session.set_expiry(2592000)  # 30 days
            
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            
            # Redirect to next page or dashboard
            next_url = request.POST.get('next') or request.GET.get('next')
            if next_url and next_url.startswith('/'):
                return redirect(next_url)
            
            return redirect('student_dashboard')
        else:
            messages.error(request, 'Invalid username/email or password')
            return render(request, 'modern/login.html', {
                'form': request.POST,
                'next': request.POST.get('next') or request.GET.get('next')
            })
    
    return render(request, 'modern/login.html', {
        'next': request.GET.get('next')
    })


def logout_view(request):
    """
    Handle user logout
    """
    logout(request)
    messages.info(request, 'You have been logged out successfully')
    return redirect('home')
