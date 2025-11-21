from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from courses.models import Category, Instructor, Course, Lesson
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create categories
        categories_data = [
            {'name': 'Programming', 'icon': 'fas fa-code', 'description': 'Learn programming languages and software development'},
            {'name': 'Design', 'icon': 'fas fa-paint-brush', 'description': 'Graphic design, UI/UX, and creative skills'},
            {'name': 'Business', 'icon': 'fas fa-briefcase', 'description': 'Business skills and entrepreneurship'},
            {'name': 'Marketing', 'icon': 'fas fa-bullhorn', 'description': 'Digital marketing and advertising'},
            {'name': 'Data Science', 'icon': 'fas fa-chart-bar', 'description': 'Data analysis and machine learning'},
            {'name': 'Kids', 'icon': 'fas fa-child', 'description': 'Educational content for children'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'icon': cat_data['icon'],
                    'description': cat_data['description']
                }
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create sample users for instructors
        instructors_data = [
            {'username': 'john_smith', 'first_name': 'John', 'last_name': 'Smith', 'email': 'john@example.com'},
            {'username': 'maria_chen', 'first_name': 'Maria', 'last_name': 'Chen', 'email': 'maria@example.com'},
            {'username': 'david_wilson', 'first_name': 'David', 'last_name': 'Wilson', 'email': 'david@example.com'},
            {'username': 'sarah_johnson', 'first_name': 'Sarah', 'last_name': 'Johnson', 'email': 'sarah@example.com'},
        ]

        for inst_data in instructors_data:
            user, created = User.objects.get_or_create(
                username=inst_data['username'],
                defaults={
                    'first_name': inst_data['first_name'],
                    'last_name': inst_data['last_name'],
                    'email': inst_data['email']
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                
                instructor, created = Instructor.objects.get_or_create(
                    user=user,
                    defaults={
                        'bio': f'Experienced instructor with expertise in various fields.',
                        'expertise': 'Software Development',
                        'years_experience': 5,
                        'is_verified': True
                    }
                )
                if created:
                    self.stdout.write(f'Created instructor: {instructor.full_name}')

        # Create sample courses
        programming_cat = Category.objects.get(name='Programming')
        design_cat = Category.objects.get(name='Design')
        business_cat = Category.objects.get(name='Business')
        marketing_cat = Category.objects.get(name='Marketing')
        
        john_instructor = Instructor.objects.get(user__username='john_smith')
        maria_instructor = Instructor.objects.get(user__username='maria_chen')
        david_instructor = Instructor.objects.get(user__username='david_wilson')
        sarah_instructor = Instructor.objects.get(user__username='sarah_johnson')

        courses_data = [
            {
                'title': 'Python for Beginners',
                'short_description': 'Learn Python programming from scratch with hands-on projects.',
                'description': 'This comprehensive Python course covers everything from basic syntax to advanced concepts. Perfect for beginners who want to start their programming journey.',
                'category': programming_cat,
                'instructor': maria_instructor,
                'price': Decimal('59.99'),
                'original_price': Decimal('99.99'),
                'difficulty': 'beginner',
                'duration_hours': 20,
                'status': 'published',
                'is_featured': True,
            },
            {
                'title': 'Graphic Design Masterclass',
                'short_description': 'Master the art of graphic design with industry-standard tools.',
                'description': 'Learn professional graphic design techniques using Adobe Creative Suite. Create stunning visuals for print and digital media.',
                'category': design_cat,
                'instructor': john_instructor,
                'price': Decimal('79.99'),
                'original_price': Decimal('129.99'),
                'difficulty': 'intermediate',
                'duration_hours': 25,
                'status': 'published',
                'is_featured': True,
                'is_bestseller': True,
            },
            {
                'title': 'Digital Marketing Fundamentals',
                'short_description': 'Learn the basics of digital marketing and grow your online presence.',
                'description': 'Comprehensive guide to digital marketing including SEO, social media marketing, email marketing, and paid advertising.',
                'category': marketing_cat,
                'instructor': sarah_instructor,
                'price': Decimal('49.99'),
                'difficulty': 'beginner',
                'duration_hours': 15,
                'status': 'published',
                'is_featured': True,
            },
            {
                'title': 'Business Strategy and Planning',
                'short_description': 'Develop effective business strategies for success.',
                'description': 'Learn how to create and implement successful business strategies. Perfect for entrepreneurs and business professionals.',
                'category': business_cat,
                'instructor': david_instructor,
                'price': Decimal('89.99'),
                'difficulty': 'advanced',
                'duration_hours': 30,
                'status': 'published',
            },
            {
                'title': 'Web Development with Django',
                'short_description': 'Build powerful web applications using Django framework.',
                'description': 'Complete Django course covering models, views, templates, and deployment. Build real-world web applications.',
                'category': programming_cat,
                'instructor': maria_instructor,
                'price': Decimal('99.99'),
                'original_price': Decimal('149.99'),
                'difficulty': 'intermediate',
                'duration_hours': 35,
                'status': 'published',
                'is_featured': True,
            },
        ]

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults=course_data
            )
            if created:
                self.stdout.write(f'Created course: {course.title}')
                
                # Add sample lessons
                lessons_data = [
                    {'title': 'Introduction and Setup', 'lesson_type': 'video', 'duration_minutes': 30, 'order': 1, 'is_preview': True},
                    {'title': 'Basic Concepts', 'lesson_type': 'video', 'duration_minutes': 45, 'order': 2},
                    {'title': 'Hands-on Practice', 'lesson_type': 'video', 'duration_minutes': 60, 'order': 3},
                    {'title': 'Advanced Topics', 'lesson_type': 'video', 'duration_minutes': 50, 'order': 4},
                    {'title': 'Final Project', 'lesson_type': 'assignment', 'duration_minutes': 90, 'order': 5},
                ]
                
                for lesson_data in lessons_data:
                    lesson_data['course'] = course
                    lesson_data['description'] = f'Lesson content for {lesson_data["title"]}'
                    Lesson.objects.create(**lesson_data)

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data!'))
