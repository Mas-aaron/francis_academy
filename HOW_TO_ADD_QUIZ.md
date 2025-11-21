# 🎯 How to Add a Quiz to Your Course

## 📍 Where to Add Quizzes

You can now add quizzes directly from the **Course Edit Page**!

---

## 🚀 Step-by-Step Guide

### **Method 1: From Course Edit Page (Easiest!)**

1. **Go to Instructor Dashboard**
   - URL: `http://localhost:8000/courses/instructor/`
   - Or click your profile → "Instructor Dashboard"

2. **Edit Your Course**
   - Find the course in your courses list
   - Click the "Edit" button

3. **Look at the Right Sidebar**
   - You'll see "Course Lessons" section
   - Each lesson has buttons on the right

4. **Add Quiz Button**
   - **If NO quiz exists:** You'll see a green **"+ Quiz"** button
   - **If quiz exists:** You'll see a purple **checkmark icon** to edit it

5. **Click "+ Quiz" Button**
   - Takes you to quiz creation form
   - Fill in quiz details
   - Add questions
   - Done!

---

## 🎨 What You'll See

### **Lesson Without Quiz:**
```
📹 Introduction          [+ Quiz] [✏️] [🗑️]
   Video • 40 min
```

### **Lesson With Quiz:**
```
📹 Introduction          [✓] [✏️] [🗑️]
   Video • 40 min
```

- **Green "+" Button** = Add new quiz
- **Purple "✓" Button** = Edit existing quiz
- **Purple Pencil** = Edit lesson
- **Red Trash** = Delete lesson

---

## 📝 Quiz Creation Form

After clicking "+ Quiz", you'll see:

### **Quiz Settings:**
- **Title**: e.g., "Introduction Quiz"
- **Description**: What the quiz covers
- **Passing Score**: Minimum % to pass (default: 70%)
- **Time Limit**: Minutes allowed (optional)

### **Example:**
```
Title: Python Basics Quiz
Description: Test your understanding of Python fundamentals
Passing Score: 75%
Time Limit: 30 minutes
```

---

## ➕ Adding Questions

After creating the quiz:

1. **Click "Add Question"**
2. **Fill Question Details:**
   - Question text
   - Type (Multiple Choice, True/False, Short Answer)
   - Points (usually 1)
   - Order (question number)

3. **Add Answer Choices:**
   - Enter 4-10 answer options
   - Check ✓ the correct answer(s)
   - Set display order

4. **Save Question**
5. **Repeat** for more questions

---

## 📊 Question Types

### **1. Multiple Choice**
```
Q: What is Python?
○ A snake
● A programming language ✓
○ A food
○ A game
```

### **2. True/False**
```
Q: Python is object-oriented.
● True ✓
○ False
```

### **3. Short Answer**
```
Q: What does HTML stand for?
[Text input: ________________]
```

---

## ✏️ Editing Existing Quiz

If a lesson already has a quiz:

1. **Click the Purple Checkmark Icon**
   - Takes you to quiz edit page

2. **You Can:**
   - Update quiz settings
   - Add more questions
   - Edit existing questions
   - Delete questions
   - Reorder questions

---

## 🎯 Quick Access URLs

### **Your Course Edit Page:**
```
/courses/instructor/courses/YOUR-COURSE-SLUG/edit/
```

### **Create Quiz for a Lesson:**
```
/courses/instructor/courses/COURSE-SLUG/lessons/LESSON-ID/quiz/create/
```

### **Edit Existing Quiz:**
```
/courses/instructor/courses/COURSE-SLUG/quiz/QUIZ-ID/edit/
```

---

## 💡 Pro Tips

### **Best Practices:**
- **10-20 questions** per quiz
- **Mix question types** for variety
- **Clear questions** - avoid ambiguity
- **Reasonable time limits** - allow thinking time
- **Set appropriate passing scores** - 70-80% is common

### **Time Limits:**
- **No limit**: Students can take as long as needed
- **15-30 min**: Short quizzes (5-10 questions)
- **45-60 min**: Medium quizzes (15-25 questions)
- **90+ min**: Full exams

### **Passing Scores:**
- **50-60%**: Basic comprehension
- **70-75%**: Standard mastery
- **80-90%**: High proficiency
- **95-100%**: Expert level

---

## 🔍 Visual Guide

### **Location of Quiz Button:**

```
┌─────────────────────────────────────┐
│  Edit: Introduction to Python      │
├─────────────────────────────────────┤
│                                     │
│  Basic Information    Course Lessons│
│  ─────────────────    ──────────────│
│                                     │
│  Course Title          1. Introduction
│  [Input field]            📹 Video • 40min
│                           [+ Quiz] [Edit] [Delete]
│  Description                          │
│  [Text area]           2. Basic Python
│                            📹 Video • 30min
│                           [✓] [Edit] [Delete]
│                                     │
└─────────────────────────────────────┘
```

The **[+ Quiz]** button appears right next to each lesson!

---

## 🎓 Student View

After you create a quiz, students will see:

### **On Lesson Page:**
- "Take Quiz" button appears
- Shows quiz title and description
- Displays time limit (if set)

### **During Quiz:**
- Timer counts down (if set)
- Questions displayed one by one
- Progress indicator
- Submit button

### **After Submission:**
- Instant score (e.g., 85%)
- Pass/Fail status
- Correct answers shown
- Time taken displayed
- Option to retake (if allowed)

---

## ⚠️ Important Notes

1. **One Quiz Per Lesson**
   - Each lesson can have only ONE quiz
   - If quiz exists, button changes to "Edit Quiz"

2. **Save Before Adding Quiz**
   - Make sure lesson is saved first
   - Then add quiz to it

3. **Question Order**
   - Questions display in order you set
   - Lower numbers appear first

4. **Auto-Grading**
   - Multiple Choice: Auto-graded ✓
   - True/False: Auto-graded ✓
   - Short Answer: Manual grading needed

---

## 🆘 Troubleshooting

### **Don't see "+ Quiz" button?**
- Refresh the page (`Ctrl + Shift + R`)
- Check if quiz already exists (purple checkmark)
- Ensure you're on course EDIT page

### **Button not working?**
- Check browser console (F12)
- Verify URL routes are correct
- Restart Django server

### **Styling looks wrong?**
- Run: `python manage.py collectstatic`
- Clear browser cache
- Check CSS file loaded

---

## 📞 Quick Reference

### **Add Quiz Workflow:**
```
1. Instructor Dashboard
   ↓
2. Edit Course
   ↓
3. Find Lesson in Sidebar
   ↓
4. Click Green "+ Quiz" Button
   ↓
5. Fill Quiz Form
   ↓
6. Add Questions
   ↓
7. Students Can Take Quiz!
```

---

## ✅ Checklist

Before publishing your quiz:

- [ ] Quiz title is descriptive
- [ ] Time limit is reasonable (or none)
- [ ] Passing score is set appropriately
- [ ] All questions are clear
- [ ] All answer choices are plausible
- [ ] Correct answers are marked
- [ ] Questions are ordered logically
- [ ] Tested quiz as a student

---

**That's it! Adding quizzes is now as easy as clicking a button!** 🎉

The green **"+ Quiz"** button is right there in your course edit page, next to each lesson. Click it and start creating quizzes! 📝✨
