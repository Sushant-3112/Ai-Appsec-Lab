# SmartLink Hub Deployment Guide

## Backend Deployment (Render / Heroku)

1. **Environment Variables Check:**
   Ensure you set `SECRET_KEY`, `JWT_SECRET_KEY`, and `DATABASE_URL` (use a PostgreSQL URL for production).

2. **Gunicorn Setup:**
   Create a `Procfile` for Heroku or set the Render build command:
   `web: gunicorn run:app`
   
3. **Database Migration:**
   If using a new PostgreSQL DB, run the initial database creation, or better yet, migrate using Flask-Migrate in production. For now, running `app.app_context().create_all()` happens automatically in our boilerplate on startup if `db.create_all()` is executed (be careful not to overwrite data).

4. **Dependencies:**
   Ensure you have a `requirements.txt` listing `gunicorn` in addition to other dependencies.

## Frontend Deployment (Vercel / Netlify)

1. **Build Config:**
   Use the default Vite settings (`npm run build`). Output directory is `dist`.

2. **Environment Variables:**
   If your API is hosted externally (e.g. `https://api.smartlink.com`), change your Axios base URL or `.env` inside Vite. You can create a `.env.production` inside the frontend folder:
   ```
   VITE_API_BASE_URL=https://api.yourbackend.com
   ```
   Modify the frontend fetching logic to pull from `import.meta.env.VITE_API_BASE_URL` or fallback to relative paths, and remove the `proxy` setup from production Vite config.

3. **Routing Configuration:**
   Because this is a Single Page Application (SPA), ensure Vercel is configured to rewrite all routes to `/index.html` (Vercel allows `vercel.json` rewrites, while Netlify uses a `_redirects` file).

   For Vercel (`vercel.json`):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
