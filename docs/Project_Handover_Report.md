# Project Handover Report

Note: Format this document in Times New Roman, 12pt, 1.5 line spacing for submission.

- Client: [CLIENT_NAME]
- Project: Professional Website Development – Concept to Handover
- Consultant: [YOUR_NAME]
- Date: [DATE]

## 1. Executive Overview
Brief summary of delivered website, its core features, and hosting architecture (Railway + Postgres, Supabase Storage).

## 2. System Architecture
- Framework: Django 4.2
- Server: Gunicorn, WhiteNoise (static)
- Database: PostgreSQL (Railway)
- Media Storage: Supabase Storage via S3 protocol
- Frontend: HTML5/CSS/JS with responsive components
- Containerization: Docker

Diagram (describe or attach): Browser → Railway app (Gunicorn/Django) → Railway Postgres → Supabase Storage.

## 3. Environments & URLs
- Production URL: https://[yourapp].railway.app
- Admin URL: https://[yourapp].railway.app/admin/

## 4. Credentials Handover
Provide separately via secure channel; list accounts that will be handed over:
- Django superuser (email/username only; password to be shared out-of-band)
- Railway project access (invite email)
- Supabase project access (invite email)
- Domain/DNS (if applicable)

## 5. Environment Variables
Production variables set in Railway:
- SECRET_KEY
- DEBUG=False
- ALLOWED_HOSTS=.railway.app, yourdomain.com
- DATABASE_URL=postgres://...
- SUPABASE_S3_ENDPOINT_URL=https://<project-ref>.supabase.co/storage/v1/s3
- SUPABASE_S3_ACCESS_KEY_ID=***
- SUPABASE_S3_SECRET_ACCESS_KEY=***
- SUPABASE_S3_BUCKET_NAME=lesson-media
- SUPABASE_S3_PUBLIC=true/false

## 6. Admin Guide
### 6.1 Users & Roles
- Login to /admin/
- Manage Users, Groups, and permissions as needed

### 6.2 Courses & Lessons
- Add Courses (title, descriptions, pricing, thumbnail)
- Add Lessons (order, type: video/text/quiz)
  - For video
    - Upload video file (stored in Supabase)
    - OR paste YouTube/Vimeo URL; YouTube embeds handled via regex + youtube-nocookie
  - For text
    - Paste lesson content
  - For quiz
    - Add quiz object and questions/choices

### 6.3 Media
- Images and uploaded videos are stored in Supabase; ensure bucket policy allows read as configured

### 6.4 Pricing & Enrollment
- Mark course free/paid
- Enrollments tracked automatically; progress recorded

## 7. Operations
### 7.1 Deployment
- Push to main; Railway auto-builds Dockerfile
- On first deploy or after migrations: `python manage.py migrate`
- Static files are collected during Docker build

### 7.2 Backups
- Database: configure Railway backups or export via pg_dump
- Media: Supabase bucket is the source of truth; use Supabase backup/export tools

### 7.3 Monitoring & Logs
- Railway logs: app and build logs available in dashboard
- Django logging can be extended (INFO/ERROR handlers)

## 8. Security
- Secrets are stored as Railway variables
- HTTPS enforced by platform; HSTS enabled in production settings
- CSRF and session cookies secured in production

## 9. Maintenance Plan (Optional)
- Monthly security updates & dependency review
- Quarterly accessibility & performance review
- Content updates, training, and support SLAs

## 10. Acceptance & Sign-off
By signing below, the Client confirms receipt and satisfactory operation of the delivered system.

Client Representative: __________________________  Date: ___________

Consultant: __________________________  Date: ___________
