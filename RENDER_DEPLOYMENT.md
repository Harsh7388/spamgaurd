# SpamGuard Backend Deployment on Render

## Backend Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy Backend to Render
1. Go to [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → Select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `spamguard-backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Runtime**: `Python 3.11`
6. Select a plan (Free tier available)
7. Click "Create Web Service"
8. Wait for deployment to complete

### 3. Get Your Backend URL
Once deployed, you'll get a URL like: `https://spamguard-backend.onrender.com`

### 4. Update Frontend API Configuration
The frontend is already configured to use the Render backend URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://spamguard-backend.onrender.com";
```

### 5. Deploy Frontend to Vercel (if needed)
The frontend is already configured with `vercel.json` for deployment.

## Troubleshooting

### Backend shows "Build failed"
- Ensure all Python dependencies are in `backend/requirements.txt`
- Check that `Procfile` and `runtime.txt` exist in the backend folder

### "Unable to reach the SpamGuard backend"
- Check that the backend service is running on Render dashboard
- Verify the backend URL is correct in frontend's `api.js`
- Free tier services may take 15-30 seconds to start after deployment

### Model files not found
The `spam_model.pkl` and `vectorizer.pkl` files must be committed to the repository for Render to include them during deployment.

## Important Notes
- The backend uses Flask with CORS enabled for cross-origin requests
- Port configuration is handled automatically by Render via the `PORT` environment variable
- Free tier may have a 15-minute startup delay after inactivity
