# 🎓 How Instructors Upload Videos - Complete Guide

## 🚀 Getting Started

### **Step 1: Access the Instructor Portal**

**For Instructors:**
1. Login to your account
2. Click on your avatar (top right)
3. Click **"Instructor Dashboard"** in the dropdown menu

**OR** 

Navigate directly to:
```
http://localhost:8000/courses/instructor/
```

---

## 📚 Creating a Course

### **Step 1: Create New Course**

1. **Click** "Create New Course" button (top right of dashboard)
2. **You'll see a form** with these sections:

#### **Basic Information:**
- **Course Title** - e.g., "Python for Beginners"
- **Short Description** - Brief summary (300 chars max)
- **Full Description** - Detailed course overview
- **Category** - Select from dropdown (Programming, Design, etc.)
- **Difficulty Level** - Beginner/Intermediate/Advanced

#### **Course Media:**
- **Thumbnail** - Click "Choose File" → Upload image (1280x720px recommended)
- **Preview Video URL** - Paste YouTube/Vimeo link (optional)

#### **Pricing:**
- **Price** - Enter amount (e.g., 49.99)
- **Original Price** - For showing discounts (optional)
- **Is Free** - Check if course is free

#### **Course Details:**
- **Duration** - Total hours (e.g., 10)
- **Language** - Default: English
- **Status** - Choose:
  - **Draft** = Not visible to students
  - **Published** = Live on platform

3. **Click "Create Course"**

---

## 🎥 Adding Video Lessons

### **Step 2: Add Lessons to Your Course**

After creating a course, you'll see the course edit page with a **"Lessons"** sidebar.

#### **Option A: Upload Video from Computer** 💻

1. **Click** "Add Lesson" button
2. **Fill in lesson details:**
   - Title: e.g., "Introduction to Python"
   - Description: Optional summary
   - Lesson Type: **Video**
   - Duration: In minutes (e.g., 15)
   - Order: 1, 2, 3... (sequence)

3. **Upload Video Tab:**
   - Click **"Upload Video File"** tab
   - **Drag & drop** video OR click to browse
   - Supports: **MP4, WebM, OGG** (max 500MB)
   - You'll see file name and size preview

4. **Settings:**
   - ✅ Check "Allow free preview" if you want this lesson free

5. **Click "Create Lesson"**

#### **Option B: Use YouTube/Vimeo URL** 🔗

1. **Click** "Add Lesson" button
2. **Fill in lesson details** (same as above)

3. **YouTube/Vimeo Tab:**
   - Click **"YouTube / Vimeo URL"** tab
   - **Paste video URL:**
     - YouTube: `https://youtube.com/watch?v=VIDEO_ID`
     - Vimeo: `https://vimeo.com/VIDEO_ID`

4. **Settings:**
   - ✅ Check "Allow free preview" if needed

5. **Click "Create Lesson"**

---

## 🎬 Complete Upload Workflow

### **Full Example: Creating "Python Course"**

```
Step 1: CREATE COURSE
├── Navigate to: /courses/instructor/
├── Click "Create New Course"
├── Fill form:
│   ├── Title: "Python for Beginners"
│   ├── Upload thumbnail image
│   ├── Price: $49.99
│   └── Status: Published
└── Click "Create Course" ✅

Step 2: ADD LESSONS
├── Lesson 1: Introduction
│   ├── Type: Video
│   ├── Upload: intro.mp4 (from computer)
│   ├── Duration: 10 min
│   ├── Order: 1
│   └── ✅ Free Preview
│
├── Lesson 2: Setup Python
│   ├── Type: Video
│   ├── URL: https://youtube.com/watch?v=xyz
│   ├── Duration: 15 min
│   └── Order: 2
│
├── Lesson 3: Variables
│   ├── Type: Video
│   ├── Upload: variables.mp4
│   ├── Duration: 20 min
│   └── Order: 3
│
└── Lesson 4: Quiz
    ├── Type: Quiz
    ├── Duration: 30 min
    └── Order: 4

Step 3: PUBLISH
└── Course Status: Published ✅
```

---

## 📊 Two Ways to Upload Videos

### **Method 1: Upload Video Files (From Computer)** ⬆️

**When to use:**
- ✅ You have videos on your computer
- ✅ You want full control over video files
- ✅ Videos are under 500MB

**How it works:**
1. Click "Upload Video File" tab
2. Drag & drop OR click to select video
3. File uploads directly to server
4. Students watch from your server

**Pros:**
- Full control
- No third-party dependency
- Downloadable videos

**Cons:**
- Server storage required
- Bandwidth costs
- No adaptive streaming

---

### **Method 2: YouTube/Vimeo URLs** 🔗

**When to use:**
- ✅ Videos already on YouTube/Vimeo
- ✅ Videos are very large (>500MB)
- ✅ You want free hosting

**How it works:**
1. Upload video to YouTube/Vimeo first
2. Copy the video URL
3. Click "YouTube / Vimeo URL" tab
4. Paste URL
5. Video embeds on your platform

**Pros:**
- Free hosting
- Fast streaming
- Adaptive quality
- No storage limits

**Cons:**
- Requires YouTube/Vimeo account
- Subject to platform rules

---

## 🎯 Quick Access URLs

Once logged in as instructor:

```
Instructor Dashboard:
http://localhost:8000/courses/instructor/

Create New Course:
http://localhost:8000/courses/instructor/courses/create/

Edit Course:
http://localhost:8000/courses/instructor/courses/YOUR-COURSE-SLUG/edit/

Add Lesson:
http://localhost:8000/courses/instructor/courses/YOUR-COURSE-SLUG/lessons/create/
```

---

## 🎨 What the Instructor Portal Looks Like

### **Dashboard:**
```
┌─────────────────────────────────────────────────────┐
│  Instructor Dashboard          [Create New Course]  │
├─────────────────────────────────────────────────────┤
│  📊 Stats:                                           │
│  [4 Courses]  [3 Published]  [120 Students]  [$5K] │
├─────────────────────────────────────────────────────┤
│  Your Courses:                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │ [Img] Python for Beginners    [Published]   │  │
│  │       25 Students  ⭐4.5  $49  [Edit] [View] │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### **Lesson Upload Screen:**
```
┌─────────────────────────────────────────────────────┐
│  Add Lesson to Python for Beginners                 │
├─────────────────────────────────────────────────────┤
│  Title: [Introduction to Python____________]        │
│  Type:  [Video ▼]  Duration: [15] min  Order: [1]  │
├─────────────────────────────────────────────────────┤
│  Video Content:                                      │
│  [Upload Video File] [YouTube / Vimeo URL]          │
│  ┌───────────────────────────────────────────────┐ │
│  │  📤 Click to upload or drag and drop          │ │
│  │     Supports MP4, WebM, OGG (Max 500MB)       │ │
│  └───────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│  [✓] Allow free preview                             │
│  [Create Lesson] [Cancel]                           │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Step-by-Step Video Upload

### **Scenario: Uploading a Video from Your Computer**

1. **Go to Instructor Dashboard**
   - Click your avatar → "Instructor Dashboard"

2. **Edit Your Course**
   - Find course → Click "Edit" button

3. **Add New Lesson**
   - Click "Add Lesson" (right sidebar)

4. **Fill Basic Info**
   ```
   Title: Lesson 1 - Introduction
   Type: Video
   Duration: 15 minutes
   Order: 1
   ```

5. **Upload Video**
   - Click "Upload Video File" tab
   - Drag your `intro.mp4` file onto the upload area
   - OR click to browse and select file
   - See preview: "intro.mp4 - 45.2 MB"

6. **Set Preview Option**
   - ✅ Check "Allow free preview" (optional)

7. **Save**
   - Click "Create Lesson"
   - Video uploads (may take a moment)
   - ✅ Success! Redirected to course edit page

8. **Add More Lessons**
   - Repeat steps 3-7 for each lesson

9. **Publish Course**
   - Ensure "Status: Published"
   - Students can now enroll!

---

## 🎓 Complete Example

### **Creating "Web Development Bootcamp"**

**1. Create Course:**
```
Title: Web Development Bootcamp
Description: Learn HTML, CSS, JavaScript from scratch
Category: Programming
Difficulty: Beginner
Thumbnail: [Upload webdev-thumb.jpg]
Price: $79.99
Original Price: $149.99 (50% off!)
Status: Published
```

**2. Add Lessons:**

**Lesson 1 - Upload from Computer:**
```
Title: Welcome to Web Development
Type: Video
Upload File: welcome.mp4 (150MB)
Duration: 12 minutes
Order: 1
✅ Free Preview
```

**Lesson 2 - YouTube URL:**
```
Title: HTML Basics
Type: Video
URL: https://youtube.com/watch?v=abc123
Duration: 25 minutes
Order: 2
```

**Lesson 3 - Upload from Computer:**
```
Title: CSS Fundamentals
Type: Video
Upload File: css-basics.mp4 (230MB)
Duration: 35 minutes
Order: 3
```

**Lesson 4 - Text Lesson:**
```
Title: HTML Cheat Sheet
Type: Text
Content: [Write markdown/HTML]
Duration: 10 minutes
Order: 4
```

**3. Done!**
- Course is live
- Students can enroll
- Videos are ready to watch

---

## 🔧 Managing Your Courses

### **Dashboard Features:**

**View All Courses:**
- See all your courses in table format
- Stats: Students, Rating, Price, Lessons
- Quick actions: Edit, View

**Edit Course:**
- Update course details
- Change thumbnail
- Modify pricing
- Edit description

**Manage Lessons:**
- Add new lessons
- Edit existing lessons
- Delete lessons
- Reorder lessons (change order number)

**Track Performance:**
- Student count
- Course ratings
- Total revenue
- Published vs draft courses

---

## 🎬 Video Upload Tips

### **Best Practices:**

**Video Format:**
✅ Use **MP4** (most compatible)
✅ Resolution: **1280x720** (720p) or **1920x1080** (1080p)
✅ File size: Keep under **500MB** per video
✅ Bitrate: 2-5 Mbps for good quality

**For Large Videos:**
✅ Use YouTube/Vimeo instead
✅ Or split into smaller segments
✅ Or compress video before upload

**File Names:**
✅ Use descriptive names: `lesson-1-intro.mp4`
✅ No spaces: Use hyphens or underscores
✅ Avoid special characters

**Upload Speed:**
- 50MB video ≈ 30 seconds (fast connection)
- 200MB video ≈ 2 minutes (fast connection)
- 500MB video ≈ 5 minutes (fast connection)

---

## 🚨 Troubleshooting

### **Video Upload Fails:**
- ✅ Check file size (max 500MB)
- ✅ Verify format (MP4, WebM, OGG)
- ✅ Try smaller file
- ✅ Check internet connection

### **YouTube URL Not Working:**
- ✅ Make sure video is "Unlisted" or "Public" (not Private)
- ✅ Use correct format: `https://youtube.com/watch?v=VIDEO_ID`
- ✅ Test URL in browser first

### **Can't See Instructor Dashboard:**
- ✅ Make sure you have an Instructor profile
- ✅ Admin needs to create instructor account
- ✅ Check if logged in

---

## 📱 Mobile Upload

**Can instructors upload from mobile?**
- ✅ Yes! The portal is fully responsive
- ✅ Works on tablets and phones
- ⚠️ Video upload may be slow on mobile data
- ✅ Recommend WiFi for uploading videos

---

## 🎉 Summary

**Instructor can upload videos in 3 ways:**

1. **Upload Video Files** (MP4, WebM, OGG)
   - Click upload area
   - Drag & drop or select file
   - Upload directly to server

2. **YouTube Links**
   - Paste YouTube URL
   - Video embeds automatically
   - Free hosting

3. **Vimeo Links**
   - Paste Vimeo URL
   - Professional quality
   - Ad-free playback

**All through the beautiful instructor portal at:**
```
/courses/instructor/
```

---

## 🔐 Access Control

**Who can upload?**
- ✅ Users with Instructor profile
- ✅ Access via "Instructor Dashboard" in user menu
- ✅ Can only edit their own courses

**Students cannot:**
- ❌ Access instructor portal
- ❌ Upload videos
- ❌ Edit courses

---

**Your instructor portal is ready to use! 🚀**

Start uploading your courses at: `http://localhost:8000/courses/instructor/`
