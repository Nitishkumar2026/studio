# 🚀 Deployment Guide

Follow these steps to deploy your AI Carousel Generator to production.

## 1. Backend Deployment (Render)
Render is a great platform for deploying Node.js apps.

1. Create a GitHub repository and push your `api` folder content (or the whole project).
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Go to the **Environment** tab and add your secrets:
   - `OPENAI_API_KEY`: Your actual OpenAI key.
   - `PORT`: `10000` (optional, Render handles this).
6. Copy the generated URL (e.g., `https://ai-carousel-api.onrender.com`).

## 2. Frontend Deployment (Vercel)
Vercel is the best platform for React/Vite apps.

1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Connect your GitHub repository.
3. In the **Build and Output Settings**, ensure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. In the **Environment Variables** section:
   - If you hardcoded the `API_BASE_URL` in `App.jsx`, update it to your Render URL before pushing.
   - Alternatively, use `VITE_API_URL` and update `App.jsx` to use `import.meta.env.VITE_API_URL`.
5. Click **Deploy**.

## 3. Important Fixes for Production
- **CORS**: In `api/index.js`, ensure you allow your Vercel URL in the CORS configuration:
  ```javascript
  app.use(cors({
    origin: 'https://your-vercel-app-url.vercel.app'
  }));
  ```
- **API URL**: In `client/src/App.jsx`, change `const API_BASE_URL = 'http://localhost:5000'` to your actual backend URL.

## 4. Connecting Everything
Once the backend is live on Render and the frontend is live on Vercel:
1. Update the Frontend URL in the Backend's CORS settings.
2. Update the Backend URL in the Frontend's API call.
3. Redeploy both.
