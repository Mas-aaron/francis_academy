from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from courses.models import Category, Instructor, Course
import random

class Command(BaseCommand):
    help = 'Populate sample categories and courses for testing'

    def handle(self, *args, **options):
        # Create categories if they don't exist
        categories_data = [
            {'name': 'Programming', 'slug': 'programming', 'description': 'Learn to code and build amazing applications'},
            {'name': 'Design', 'slug': 'design', 'description': 'Master visual design and user experience'},
            {'name': 'Business', 'slug': 'business', 'description': 'Develop business skills and entrepreneurship'},
            {'name': 'Marketing', 'slug': 'marketing', 'description': 'Digital marketing and growth strategies'},
            {'name': 'Data Science', 'slug': 'data-science', 'description': 'Analyze data and build machine learning models'},
            {'name': 'Kids', 'slug': 'kids', 'description': 'Fun and educational courses for children'},
        ]

        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data['description']
                }
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
            else:
                self.stdout.write(f'Category exists: {category.name}')

        # Create a sample instructor if none exists
        if not User.objects.filter(username='instructor').exists():
            user = User.objects.create_user(
                username='instructor',
                email='instructor@example.com',
                first_name='John',
                last_name='Doe',
                password='password123'
            )
            
            instructor, created = Instructor.objects.get_or_create(
                user=user,
                defaults={
                    'bio': 'Experienced instructor with 10+ years in the industry',
                    'expertise': 'Full-stack development, Data Science, Business Strategy',
                    'years_experience': 10,
                    'is_verified': True
                }
            )
            self.stdout.write(f'Created instructor: {instructor.full_name}')
        else:
            instructor = Instructor.objects.first()

        # Create sample courses for each category
        course_templates = {
            'Programming': [
                'Python for Beginners', 'JavaScript Mastery', 'React Development',
                'Django Web Development', 'Machine Learning with Python',
                'Mobile App Development', 'Web Development Bootcamp'
            ],
            'Design': [
                'UI/UX Design Fundamentals', 'Adobe Photoshop Mastery',
                'Figma for Designers', 'Graphic Design Principles'
            ],
            'Business': [
                'Digital Marketing Strategy', 'Project Management',
                'Leadership Skills', 'Financial Planning', 'Startup Fundamentals'
            ],
            'Marketing': [
                'Social Media Marketing', 'Content Marketing',
                'Email Marketing', 'SEO Optimization'
            ],
            'Data Science': [
                'Data Analysis with Python', 'Statistics for Data Science',
                'Deep Learning', 'Data Visualization'
            ],
            'Kids': [
                'Coding for Kids', 'Creative Writing', 'Math Fun'
            ]
        }

        for category in categories:
            if category.name in course_templates:
                course_names = course_templates[category.name]
                
                for course_name in course_names:
                    # Create a proper slug without special characters
                    import re
                    slug = course_name.lower()
                    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove special characters
                    slug = re.sub(r'[-\s]+', '-', slug)   # Replace spaces and multiple hyphens with single hyphen
                    slug = slug.strip('-')                # Remove leading/trailing hyphens
                    
                    course, created = Course.objects.get_or_create(
                        title=course_name,
                        category=category,
                        defaults={
                            'slug': slug,
                            'description': f'Learn {course_name} from scratch with hands-on projects and real-world examples.',
                            'short_description': f'Master {course_name} with expert guidance.',
                            'instructor': instructor,
                            'price': random.uniform(29.99, 199.99),
                            'difficulty': random.choice(['beginner', 'intermediate', 'advanced']),
                            'duration_hours': random.randint(5, 40),
                            'status': 'published',
                            'is_featured': random.choice([True, False]),
                            'language': 'English'
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'Created course: {course.title}')

        # Print summary
        self.stdout.write('\n--- SUMMARY ---')
        for category in Category.objects.all():
            course_count = category.courses.filter(status='published').count()
            self.stdout.write(f'{category.name}: {course_count} courses')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated sample data!')
        )
