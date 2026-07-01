# QUICK START DEPLOYMENT GUIDE

## ✅ What's Ready

Your project is now configured for Render deployment:
- ✅ Backend `Procfile` created
- ✅ `runtime.txt` specifies Python 3.11.9
- ✅ `gunicorn` added to requirements
- ✅ Flask app configured for production
- ✅ CORS enabled for frontend requests
- ✅ All files committed to git

## 🚀 Deploy in 3 Steps

### Step 1: Create GitHub Repository
```bash
# If you don't have a GitHub repo yet, create one at https://github.com/new

# Then link your local repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/spamguard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. **Go to** https://render.com
2. **Sign up/Login** with GitHub
3. **Click** "New +" → "Web Service"
4. **Select** your SpamGuard repository
5. **Fill in settings:**
   - Name: `spamguard-backend`
   - Environment: `Python`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - Python Version: `3.11`
6. **Click** "Create Web Service"
7. **Wait** 2-5 minutes for deployment

### Step 3: Get Your URL
Once deployed, you'll see your backend URL in the Render dashboard:
```
https://spamguard-backend-xxx.onrender.com
```

✅ **That's it!** Your frontend will automatically connect to it.

## 📝 Files Configured for Deployment

- `backend/Procfile` - Production server configuration
- `backend/runtime.txt` - Python version specification
- `backend/requirements.txt` - Dependencies (including gunicorn)
- `backend/app.py` - Uses PORT environment variable
- `frontend/src/services/api.js` - Already points to Render backend

## ⚠️ Important Notes

- **First deployment** takes 2-5 minutes
- **Free tier** may sleep after 15 minutes of inactivity (wakes up in ~30 seconds)
- **Backend URL** format: `https://spamguard-backend-xxxx.onrender.com`
- Frontend is already configured - **no changes needed**

## 🆘 Troubleshooting

**"Unable to reach backend" error:**
- Check if Render service shows "Live" status
- Free tier services take time to start
- Clear browser cache and refresh

**Build fails on Render:**
- Ensure all files are committed: `git status`
- Check logs in Render dashboard for errors
- Model files are included: `spam_model.pkl`, `vectorizer.pkl`

## Run Deployment Script (Optional)
```bash
# Windows
DEPLOY.bat

# Mac/Linux
chmod +x DEPLOY.sh
./DEPLOY.sh
```
