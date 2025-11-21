# 🎓 Creating an Instructor Profile

## ✅ Issue Fixed
The login URL issue has been fixed. Django will now redirect to `/login/` correctly.

---

## 🔧 Next Step: Create Instructor Profile

Your superuser account needs an **Instructor profile** to access the instructor portal.

### **Method 1: Via Django Admin (Easiest)**

1. **Start the server:**
   ```bash
   python manage.py runserver
   ```

2. **Login to Admin:**
   - Navigate to: http://localhost:8000/admin/
   - Username: `Frncis`
   - Password: (your password)

3. **Create Instructor Profile:**
   - Click **"Instructors"** in the left sidebar
   - Click **"Add Instructor"** (top right)
   - Fill in:
     - **User:** Select "Frncis" from dropdown
     - **Full Name:** Francis Academy
     - **Bio:** Expert instructor in web development
     - **Expertise:** Web Development, Programming
     - **Years of Experience:** 5
     - **Profile Picture:** (optional, upload image)
     - **✅ Is Verified:** Check this box
   - Click **"Save"**

4. **Done!** ✅

---

### **Method 2: Via Django Shell**

```bash
python manage.py shell
```

Then run:

```python
from django.contrib.auth.models import User
from courses.models import Instructor

# Get the superuser
user = User.objects.get(username='Frncis')

# Create instructor profile
instructor = Instructor.objects.create(
    user=user,
    bio='Expert instructor passionate about teaching',
    expertise='Web Development, Python, Django',
    years_experience=5,
    is_verified=True
)

print("✅ Instructor profile created!")
exit()
```

---

## 🚀 Access Instructor Portal

Once the Instructor profile is created:

1. **Login** to the site
2. **Click your avatar** (top right)
3. **You'll see "Instructor Dashboard"** in the dropdown
4. **Click it** to access: `/courses/instructor/`

---

## 🎯 Quick Test

**After creating instructor profile:**

1. Navigate to: http://localhost:8000/courses/instructor/
2. You should see the Instructor Dashboard
3. Click "Create New Course"
4. Start uploading! 🎉

---

## ⚠️ Important Notes

- **Superuser ≠ Instructor**
  - Superusers can access admin panel
  - Instructors can upload courses
  - You need BOTH accounts linked

- **Each instructor must have:**
  - User account (login credentials)
  - Instructor profile (course creation rights)

- **Students don't see "Instructor Dashboard"**
  - Only shows for users with Instructor profile

---

## 🔍 Verify Instructor Access

**Check if it worked:**

1. Login to the site
2. Click your avatar
3. Look for "Instructor Dashboard" menu item
4. If you see it → ✅ Success!
5. If not → Create instructor profile again

---

## 📊 Summary

```
Step 1: Fixed LOGIN_URL ✅ (Already done)
Step 2: Create Instructor Profile ⏳ (Do this now)
Step 3: Access /courses/instructor/ ✅ (Ready!)
```

**Create the instructor profile using Method 1 (Admin) or Method 2 (Shell), then you're ready to upload courses!** 🚀
