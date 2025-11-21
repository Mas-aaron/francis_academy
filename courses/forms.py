from django import forms
from django.forms import inlineformset_factory
from .models import Review, Course, Lesson, Category, Quiz, QuizQuestion, QuizChoice


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(
                choices=Review.RATING_CHOICES,
                attrs={
                    'class': 'form-select',
                    'required': True
                }
            ),
            'comment': forms.Textarea(
                attrs={
                    'class': 'form-control',
                    'rows': 4,
                    'placeholder': 'Share your experience with this course...',
                    'required': True
                }
            )
        }


class CourseSearchForm(forms.Form):
    search = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Search courses...',
                'id': 'search-input'
            }
        )
    )
    
    category = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )
    
    difficulty = forms.ChoiceField(
        choices=[('', 'All Levels')] + Course.DIFFICULTY_CHOICES,
        required=False,
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )
    
    price = forms.ChoiceField(
        choices=[
            ('', 'All Prices'),
            ('free', 'Free'),
            ('paid', 'Paid')
        ],
        required=False,
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )
    
    sort = forms.ChoiceField(
        choices=[
            ('newest', 'Newest'),
            ('oldest', 'Oldest'),
            ('price_low', 'Price: Low to High'),
            ('price_high', 'Price: High to Low'),
            ('rating', 'Highest Rated'),
            ('popular', 'Most Popular')
        ],
        required=False,
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        )
    )


# Instructor Forms
class CourseForm(forms.ModelForm):
    """Form for instructors to create/edit courses"""
    
    class Meta:
        model = Course
        fields = [
            'title', 'short_description', 'description', 'category',
            'thumbnail', 'preview_video', 'price', 'original_price',
            'is_free', 'difficulty', 'duration_hours', 'language', 'status'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter course title'
            }),
            'short_description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Brief course description (max 300 characters)',
                'maxlength': 300
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 8,
                'placeholder': 'Full course description'
            }),
            'category': forms.Select(attrs={
                'class': 'form-select'
            }),
            'thumbnail': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'preview_video': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'YouTube or Vimeo URL (optional)'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0.00',
                'step': '0.01'
            }),
            'original_price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0.00 (optional)',
                'step': '0.01'
            }),
            'is_free': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'difficulty': forms.Select(attrs={
                'class': 'form-select'
            }),
            'duration_hours': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Total hours'
            }),
            'language': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'English'
            }),
            'status': forms.Select(attrs={
                'class': 'form-select'
            })
        }


class LessonForm(forms.ModelForm):
    """Form for instructors to create/edit lessons with video upload"""
    
    # Add video file upload field
    video_file = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': 'video/*',
            'id': 'video-file-input'
        }),
        help_text='Upload video from your computer (MP4, WebM, OGG)'
    )
    
    class Meta:
        model = Lesson
        fields = [
            'title', 'description', 'lesson_type', 'video_url',
            'text_content', 'duration_minutes', 'order', 'is_preview'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Lesson title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Lesson description (optional)'
            }),
            'lesson_type': forms.Select(attrs={
                'class': 'form-select'
            }),
            'video_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'YouTube, Vimeo, or video URL',
                'id': 'video-url-input'
            }),
            'text_content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 10,
                'placeholder': 'Text content for text-based lessons'
            }),
            'duration_minutes': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Duration in minutes'
            }),
            'order': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Lesson order (1, 2, 3...)'
            }),
            'is_preview': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }
    
    def clean(self):
        cleaned_data = super().clean()
        lesson_type = cleaned_data.get('lesson_type')
        video_url = cleaned_data.get('video_url')
        video_file = cleaned_data.get('video_file')
        text_content = cleaned_data.get('text_content')
        
        # Validation based on lesson type
        if lesson_type == 'video':
            if not video_url and not video_file:
                raise forms.ValidationError('Please provide either a video URL or upload a video file.')
        elif lesson_type == 'text':
            if not text_content:
                raise forms.ValidationError('Please provide text content for text-based lessons.')
        
        return cleaned_data


# ==================== QUIZ FORMS ====================

class QuizForm(forms.ModelForm):
    """Form for creating and editing quizzes"""
    class Meta:
        model = Quiz
        fields = ['title', 'description', 'passing_score', 'time_limit']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Chapter 1 Quiz'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Brief description of what this quiz covers...'
            }),
            'passing_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'value': 70,
                'placeholder': 'Percentage (0-100)'
            }),
            'time_limit': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'placeholder': 'Time limit in minutes (optional)'
            }),
        }
        help_texts = {
            'passing_score': 'Percentage required to pass (0-100)',
            'time_limit': 'Leave blank for no time limit'
        }


class QuizQuestionForm(forms.ModelForm):
    """Form for creating and editing quiz questions"""
    class Meta:
        model = QuizQuestion
        fields = ['question_text', 'question_type', 'points', 'order']
        widgets = {
            'question_text': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Enter your question here...'
            }),
            'question_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'points': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'value': 1
            }),
            'order': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'value': 0
            }),
        }


class QuizChoiceForm(forms.ModelForm):
    """Form for creating and editing quiz answer choices"""
    class Meta:
        model = QuizChoice
        fields = ['choice_text', 'is_correct', 'order']
        widgets = {
            'choice_text': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter answer choice...'
            }),
            'is_correct': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'order': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'value': 0
            }),
        }


# Formset for managing multiple choices per question
QuizChoiceFormSet = inlineformset_factory(
    QuizQuestion,
    QuizChoice,
    form=QuizChoiceForm,
    extra=4,  # Show 4 empty choice forms by default
    max_num=10,  # Maximum 10 choices per question
    can_delete=True,
    validate_max=True
)
