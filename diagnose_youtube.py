#!/usr/bin/env python
"""
Diagnostic script to analyze YouTube embed issues
"""
import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'francis_academy.settings')
django.setup()

from courses.models import Lesson, Course
from courses.templatetags.course_extras import youtube_id, vimeo_id

print("=" * 70)
print("YOUTUBE EMBED DIAGNOSTIC TOOL")
print("=" * 70)

# Find all lessons with video URLs
lessons_with_urls = Lesson.objects.filter(lesson_type='video').exclude(video_url='').exclude(video_url=None)

print(f"\n✅ Found {lessons_with_urls.count()} video lessons with URLs\n")

if lessons_with_urls.count() == 0:
    print("⚠️  No lessons found with video URLs!")
    print("Please create a lesson with a YouTube URL first.\n")
else:
    for lesson in lessons_with_urls:
        print("-" * 70)
        print(f"📹 Lesson: {lesson.title}")
        print(f"📚 Course: {lesson.course.title}")
        print(f"🔗 Video URL: {lesson.video_url}")
        print(f"📁 Video File: {lesson.video_file if lesson.video_file else 'None'}")
        
        # Test YouTube detection
        if 'youtube.com' in lesson.video_url or 'youtu.be' in lesson.video_url:
            print(f"✅ Detected as: YouTube URL")
            
            # Test the filter
            video_id = youtube_id(lesson.video_url)
            print(f"🎬 Extracted Video ID: {video_id}")
            
            if video_id:
                print(f"✅ Filter working! Embed URL: https://www.youtube.com/embed/{video_id}")
            else:
                print(f"❌ Filter failed to extract video ID!")
                print(f"🔍 URL format issue - please check URL structure")
                
                # Try manual extraction
                patterns = [
                    r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
                    r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})'
                ]
                
                for pattern in patterns:
                    match = re.search(pattern, lesson.video_url)
                    if match:
                        print(f"✅ Manual extraction found ID: {match.group(1)}")
                        break
                else:
                    print(f"❌ No valid YouTube video ID found in URL")
                    
        elif 'vimeo.com' in lesson.video_url:
            print(f"✅ Detected as: Vimeo URL")
            video_id = vimeo_id(lesson.video_url)
            print(f"🎬 Extracted Video ID: {video_id}")
            
            if video_id:
                print(f"✅ Filter working! Embed URL: https://player.vimeo.com/video/{video_id}")
            else:
                print(f"❌ Filter failed to extract video ID!")
                
        else:
            print(f"ℹ️  Detected as: Direct video URL")
            print(f"📺 Will use <video> tag instead of iframe")
        
        print()

print("=" * 70)
print("TEMPLATE FILTER TEST")
print("=" * 70)

# Test the filters with common URL formats
test_urls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://vimeo.com/123456789",
    "https://vimeo.com/video/123456789",
]

print("\n🧪 Testing filter with common URL formats:\n")

for url in test_urls:
    print(f"URL: {url}")
    if 'youtube' in url or 'youtu.be' in url:
        vid_id = youtube_id(url)
        print(f"  → YouTube ID: {vid_id}")
        print(f"  → Embed: https://www.youtube.com/embed/{vid_id}")
    elif 'vimeo' in url:
        vid_id = vimeo_id(url)
        print(f"  → Vimeo ID: {vid_id}")
        print(f"  → Embed: https://player.vimeo.com/video/{vid_id}")
    print()

print("=" * 70)
print("RECOMMENDATIONS")
print("=" * 70)

lessons_with_youtube = lessons_with_urls.filter(video_url__icontains='youtube')
lessons_with_vimeo = lessons_with_urls.filter(video_url__icontains='vimeo')

if lessons_with_youtube.exists():
    print("\n✅ YouTube URLs found in database")
    for lesson in lessons_with_youtube:
        vid_id = youtube_id(lesson.video_url)
        if not vid_id:
            print(f"⚠️  Lesson '{lesson.title}' has invalid YouTube URL")
            print(f"   Current URL: {lesson.video_url}")
            print(f"   Should be like: https://www.youtube.com/watch?v=VIDEO_ID")

if lessons_with_vimeo.exists():
    print("\n✅ Vimeo URLs found in database")
    for lesson in lessons_with_vimeo:
        vid_id = vimeo_id(lesson.video_url)
        if not vid_id:
            print(f"⚠️  Lesson '{lesson.title}' has invalid Vimeo URL")
            print(f"   Current URL: {lesson.video_url}")
            print(f"   Should be like: https://vimeo.com/123456789")

print("\n" + "=" * 70)
print("ANALYSIS COMPLETE")
print("=" * 70)
print("\n📝 Next steps:")
print("1. Check if video IDs were extracted correctly above")
print("2. If extraction failed, update the lesson with a valid YouTube URL")
print("3. Valid YouTube formats:")
print("   - https://www.youtube.com/watch?v=VIDEO_ID")
print("   - https://youtu.be/VIDEO_ID")
print("4. Make sure video is Public or Unlisted (not Private)")
print("5. Refresh browser after fixing: Ctrl+Shift+R")
print()
