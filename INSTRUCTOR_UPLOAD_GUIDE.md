# 📚 Instructor Content Upload Guide

## 🎯 How Instructors Upload Videos & Course Content

Currently, instructors use the **Django Admin Panel** to upload and manage course content. Here's the complete guide:

---

## 🔐 Access Method

### **Step 1: Access Admin Panel**
```
URL: http://yourdomain.com/admin/
```

**Login with:**
- Username (instructor account)
- Password

---

## 📹 How to Upload Course Content

### **Option 1: Create a New Course**

**Step 1: Navigate to Courses**
```
Admin Dashboard → Courses → Add Course
```

**Step 2: Fill Course Information**

**Basic Information:**
- ✅ **Title** - Course name
- ✅ **Description** - Full course description
- ✅ **Short Description** - Brief summary (300 chars)
- ✅ **Category** - Select category (e.g., Programming, Design)
- ✅ **Instructor** - Automatically assigned

**Media:**
- ✅ **Thumbnail** - Upload course thumbnail image
  - Recommended: 1280x720px (16:9 ratio)
  - Format: JPG, PNG
  - Max size: 5MB

- ✅ **Preview Video** - Video URL
  - YouTube URL: `https://youtube.com/watch?v=VIDEO_ID`
  - Vimeo URL: `https://vimeo.com/VIDEO_ID`
  - Or direct video URL

**Pricing:**
- ✅ **Price** - Course price (e.g., 49.99)
- ✅ **Original Price** - For discount display (e.g., 99.99)
- ✅ **Is Free** - Check if course is free

**Course Details:**
- ✅ **Difficulty** - Beginner / Intermediate / Advanced
- ✅ **Duration Hours** - Total course length
- ✅ **Language** - Default: English

**Status:**
- ✅ **Status** - Draft / Published / Archived
- ✅ **Is Featured** - Display on homepage
- ✅ **Is Bestseller** - Add bestseller badge

---

### **Option 2: Add Lessons to Course**

**Method 1: Inline Lessons (While Creating Course)**

When creating/editing a course, scroll down to **Lessons** section:

**For Each Lesson:**
1. **Title** - Lesson name (e.g., "Introduction to Python")
2. **Lesson Type** - Select:
   - 📹 **Video** - Video lesson
   - 📄 **Text** - Text/article lesson
   - ❓ **Quiz** - Quiz/assessment
   - 📝 **Assignment** - Assignment task

3. **Video URL** - For video lessons:
   - YouTube: `https://youtube.com/watch?v=VIDEO_ID`
   - Vimeo: `https://vimeo.com/VIDEO_ID`
   - Direct: `https://yourdomain.com/media/videos/lesson.mp4`

4. **Text Content** - For text lessons (Rich text editor)

5. **Duration** - Lesson length in minutes

6. **Order** - Lesson sequence (1, 2, 3...)

7. **Is Preview** - ✅ Check to allow preview without enrollment

**Click "Add Another Lesson"** to add more lessons inline.

---

**Method 2: Add Lessons Separately**

```
Admin Dashboard → Lessons → Add Lesson
```

**Fill out:**
- ✅ Course (select course)
- ✅ Title
- ✅ Description
- ✅ Lesson Type (Video/Text/Quiz/Assignment)
- ✅ Video URL (for videos)
- ✅ Text Content (for text lessons)
- ✅ Duration (minutes)
- ✅ Order (sequence number)
- ✅ Is Preview (optional)

---

## 📹 Video Upload Methods

### **Method 1: YouTube (Recommended ⭐)**

**Advantages:**
- ✅ Free hosting
- ✅ Fast streaming
- ✅ Adaptive quality
- ✅ Mobile optimized
- ✅ Analytics

**How to:**
1. Upload video to YouTube
2. Set video to **Unlisted** (recommended) or Public
3. Copy video URL: `https://youtube.com/watch?v=VIDEO_ID`
4. Paste in **Video URL** field

**Example:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

### **Method 2: Vimeo**

**Advantages:**
- ✅ Professional quality
- ✅ Ad-free
- ✅ Better privacy controls
- ✅ Clean player

**How to:**
1. Upload to Vimeo
2. Copy video URL: `https://vimeo.com/VIDEO_ID`
3. Paste in **Video URL** field

**Example:**
```
https://vimeo.com/123456789
```

---

### **Method 3: Direct Upload (Self-Hosted)**

**Advantages:**
- ✅ Full control
- ✅ No third-party dependency
- ✅ Downloadable videos

**Disadvantages:**
- ❌ Requires server storage
- ❌ Bandwidth costs
- ❌ No adaptive streaming

**How to:**
1. Upload video file to server via:
   - Django Admin media upload
   - FTP/SFTP to `/media/videos/` folder
   
2. Use URL format:
```
/media/videos/lesson-1-intro.mp4
```

**Supported formats:**
- MP4 (recommended)
- WebM
- OGG

---

## 🖼️ Thumbnail Upload

**Navigate to Course → Media section**

**Upload thumbnail:**
- Click "Choose File"
- Select image (JPG, PNG)
- Recommended size: **1280x720px** (16:9)
- Click "Save"

**Thumbnail appears on:**
- Course listing page
- Course cards
- Search results
- Related courses

---

## 📝 Current Workflow Summary

### **Creating a Complete Course:**

**1. Create Course**
```
Admin → Courses → Add Course
↓
Fill basic info, upload thumbnail, set price
↓
Save Course
```

**2. Add Lessons**
```
Option A: While editing course, add lessons inline
Option B: Admin → Lessons → Add Lesson
↓
For each lesson:
  - Enter title
  - Select lesson type (video/text/quiz)
  - Add video URL or text content
  - Set duration and order
↓
Save Lesson
```

**3. Publish Course**
```
Edit Course → Status: Published → Save
```

---

## 🎨 What Instructors Can Manage

### **Through Django Admin:**

**Courses:**
- ✅ Create/Edit/Delete courses
- ✅ Upload thumbnails
- ✅ Add preview videos
- ✅ Set pricing
- ✅ Publish/unpublish
- ✅ Feature on homepage

**Lessons:**
- ✅ Create video lessons (YouTube/Vimeo URLs)
- ✅ Create text lessons (rich text)
- ✅ Create quizzes
- ✅ Create assignments
- ✅ Set lesson order
- ✅ Mark as preview (free)

**Student Management:**
- ✅ View enrollments
- ✅ Track student progress
- ✅ See reviews/ratings

**Announcements:**
- ✅ Post course announcements
- ✅ Notify enrolled students

**Discussions:**
- ✅ Reply to student questions
- ✅ Moderate discussions

---

## 📊 Data Model Structure

### **Course Structure:**
```
Course
├── Basic Info (title, description, category)
├── Media (thumbnail, preview video)
├── Pricing (price, original price)
├── Settings (difficulty, duration, language)
├── Status (draft/published, featured, bestseller)
└── Lessons
    ├── Lesson 1 (video/text/quiz/assignment)
    ├── Lesson 2
    └── Lesson 3...
```

### **Lesson Types:**

**1. Video Lesson:**
```
- Title: "Introduction to Python"
- Type: Video
- Video URL: https://youtube.com/watch?v=...
- Duration: 15 minutes
- Order: 1
- Is Preview: Yes
```

**2. Text Lesson:**
```
- Title: "Python Setup Guide"
- Type: Text
- Text Content: (Rich text editor)
- Duration: 10 minutes
- Order: 2
```

**3. Quiz Lesson:**
```
- Title: "Python Basics Quiz"
- Type: Quiz
- Quiz: (Link to quiz)
- Duration: 20 minutes
- Order: 3
```

---

## 🚀 Step-by-Step Example

### **Creating "Python for Beginners" Course**

**Step 1: Create Course**
```
Title: Python for Beginners
Description: Learn Python from scratch...
Category: Programming
Thumbnail: [Upload python-course.jpg]
Preview Video: https://youtube.com/watch?v=xyz123
Price: 49.99
Original Price: 99.99
Difficulty: Beginner
Duration: 10 hours
Status: Published
Is Featured: Yes
```

**Step 2: Add Lessons**

**Lesson 1:**
```
Title: Introduction to Python
Type: Video
Video URL: https://youtube.com/watch?v=abc123
Duration: 15
Order: 1
Is Preview: Yes ✅
```

**Lesson 2:**
```
Title: Installing Python
Type: Video
Video URL: https://youtube.com/watch?v=def456
Duration: 20
Order: 2
Is Preview: No
```

**Lesson 3:**
```
Title: Variables and Data Types
Type: Video
Video URL: https://youtube.com/watch?v=ghi789
Duration: 25
Order: 3
```

**Lesson 4:**
```
Title: Python Basics Quiz
Type: Quiz
Quiz: [Create quiz separately]
Duration: 30
Order: 4
```

**Step 3: Publish**
```
Course Status: Published ✅
```

---

## 💡 Best Practices for Instructors

### **Video Upload:**
✅ **Use YouTube or Vimeo** for best performance
✅ **Set to Unlisted** on YouTube for privacy
✅ **Test video playback** before publishing
✅ **Use consistent video quality** (720p or 1080p)
✅ **Add clear titles** to videos

### **Course Structure:**
✅ **Order lessons logically** (1, 2, 3...)
✅ **Mark intro as preview** to attract students
✅ **Set accurate durations** for student planning
✅ **Mix content types** (video + text + quiz)
✅ **Add descriptions** to each lesson

### **Thumbnails:**
✅ **Use high-quality images** (1280x720px)
✅ **Include text overlay** with course name
✅ **Use consistent branding** across courses
✅ **Make it attractive** for better clicks

### **Pricing:**
✅ **Research competitor pricing**
✅ **Use original price** to show value
✅ **Offer discounts** strategically
✅ **Consider free intro courses**

---

## 🔒 Access Permissions

### **Instructors Can:**
- ✅ Create/edit their own courses
- ✅ Add/edit lessons to their courses
- ✅ View student enrollments
- ✅ Respond to discussions
- ✅ Post announcements
- ✅ View analytics (if enabled)

### **Instructors Cannot:**
- ❌ Edit other instructors' courses
- ❌ Delete enrollments
- ❌ Access admin settings
- ❌ Change site configuration

---

## 📈 Current System Capabilities

### **✅ What's Available:**
- Django Admin panel for course management
- Video URL support (YouTube, Vimeo, direct)
- Image upload for thumbnails
- Lesson ordering system
- Preview lesson option
- Multiple lesson types (video, text, quiz, assignment)
- Course status management (draft/published)
- Pricing and discount system
- Category organization
- Instructor profiles

### **🔮 Future Enhancements (Potential):**
- Dedicated instructor dashboard
- Bulk lesson upload
- Video upload directly to server
- Drag-and-drop lesson reordering
- Advanced analytics
- Student messaging system
- Live class scheduling
- Certificate customization

---

## 🆘 Troubleshooting

### **Video Not Playing?**
✅ Check video URL is correct
✅ Ensure video is not private on YouTube/Vimeo
✅ Try setting to "Unlisted" instead of private
✅ Test URL in browser first

### **Thumbnail Not Showing?**
✅ Check image file size (< 5MB)
✅ Use JPG or PNG format
✅ Recommended size: 1280x720px
✅ Run `python manage.py collectstatic` after upload

### **Lesson Not Appearing?**
✅ Check lesson order number is correct
✅ Ensure course is published
✅ Verify lesson is saved properly
✅ Refresh course page

---

## 📞 Getting Started as Instructor

### **Initial Setup:**

**1. Get Instructor Account**
```
Contact admin to create instructor profile
```

**2. Access Admin Panel**
```
URL: /admin/
Login with credentials
```

**3. Create Your First Course**
```
Courses → Add Course
Fill required fields
Save
```

**4. Add Lessons**
```
Edit course → Lessons section
Add lessons inline or separately
```

**5. Publish**
```
Status: Published
Save course
```

**6. Share**
```
Course URL: /courses/your-course-slug/
```

---

## 🎓 Summary

**Instructors upload course content through Django Admin Panel:**

**Videos:** Upload to YouTube/Vimeo → Copy URL → Paste in lesson
**Thumbnails:** Upload directly via admin (JPG/PNG, 1280x720px)
**Lessons:** Create via admin panel (video URL, text, quiz)
**Order:** Set lesson sequence with order numbers
**Publish:** Change status from "Draft" to "Published"

**Simple workflow:**
```
1. Create Course
2. Upload Thumbnail
3. Add Lessons (with video URLs)
4. Set Order
5. Publish
6. Share Course URL
```

---

## 📁 Key Files Reference

**Models:** `courses/models.py`
- Course model (line 48-135)
- Lesson model (line 137-175)

**Admin:** `courses/admin.py`
- Course admin configuration (line 35-68)
- Lesson inline admin (line 28-32)

**Upload Directories:**
- Thumbnails: `/media/course_thumbnails/`
- Instructor profiles: `/media/instructors/`
- Videos: External (YouTube/Vimeo) or `/media/videos/`

---

**The current system is fully functional for instructors to upload and manage course content through the Django Admin panel!** 🎓✨
