# 🚀 Deploying LifeXP to Render

This guide will walk you through deploying your LifeXP application to Render with PostgreSQL database, backend API, and frontend static site.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at https://render.com (free tier available)
3. **Push Your Code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

## 🗄️ Step 1: Prepare Your Database

### Option A: Using Existing Neon Database (Recommended if you already have it)

1. **Go to your Neon Dashboard** (https://console.neon.tech)
2. Select your LifeXP database project
3. **Copy your connection details**:
   - Go to "Connection Details" section
   - Copy these values:
     - **PGHOST**: `<project-name>.neon.tech`
     - **PGDATABASE**: `neondb` (or your database name)
     - **PGUSER**: `<your-username>`
     - **PGPASSWORD**: `<your-password>`
     - **DATABASE_URL**: Full connection string (starts with `postgresql://`)

4. **Verify Tables Exist** (or create them):
   - Use Neon's SQL Editor or connect via psql
   - If tables don't exist, run these SQL files in order:
     ```sql
     -- 1. create_users_table.sql
     -- 2. create_habits_table.sql
     -- 3. create_habit_logs_table.sql
     -- 4. create_daily_stats_table.sql
     -- 5. create_todos_table.sql
     -- 6. create_journal_entries_table.sql
     ```

**✅ Skip to Step 2 below** - No need to create a new database on Render!

---

### Option B: Create New Database on Render (If you don't have Neon)

1. **Go to Render Dashboard** (https://dashboard.render.com)
2. Click **"New +"** → Select **"PostgreSQL"**
3. Fill in details:
   - **Name**: `lifexp-db`
   - **Database**: `lifexp`
   - **User**: `lifexp_user` (auto-generated)
   - **Region**: Choose closest to your location
   - **Plan**: Select **Free**
4. Click **"Create Database"**
5. **Wait 2-3 minutes** for database to provision
6. **Copy the connection details** from Render
7. **Run SQL files** to create tables (same as Option A step 4)

---

## 🖥️ Step 2: Deploy Backend API

1. Go to Render Dashboard
2. Click **"New +"** → Select **"Web Service"**
3. Connect your **GitHub repository** (authorize Render)
4. Fill in details:
   - **Name**: `lifexp-backend`
   - **Root Directory**: Leave empty (or use `server` if you want)
   - **Environment**: **Node**
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Select **Free**

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 3000
   JWT_SECRET = your-super-secret-jwt-key-min-32-chars
   CLIENT_URL = https://lifexp-frontend.onrender.com
   
   # Use your Neon database credentials:
   PGHOST = <your-project>.neon.tech
   PGDATABASE = neondb
   PGUSER = <your-neon-username>
   PGPASSWORD = <your-neon-password>
   ```

   **💡 Tip**: Copy these values directly from your Neon dashboard connection details!

6. Click **"Create Web Service"**
7. **Wait 5-10 minutes** for initial build and deployment
8. **Copy your backend URL**: `https://lifexp-backend.onrender.com`

## 🌐 Step 3: Deploy Frontend

1. Go to Render Dashboard
2. Click **"New +"** → Select **"Static Site"**
3. Connect your **GitHub repository**
4. Fill in details:
   - **Name**: `lifexp-frontend`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Branch**: `main`

5. **Add Environment Variable**:
   ```
   VITE_API_URL = https://lifexp-backend.onrender.com
   ```

6. Click **"Create Static Site"**
7. **Wait 5-10 minutes** for build
8. **Your app is live!** Copy the URL: `https://lifexp-frontend.onrender.com`

## 🔄 Step 4: Update Backend CORS

1. Go to your **backend service** on Render
2. Go to **Environment** tab
3. Update `CLIENT_URL` variable to your actual frontend URL:
   ```
   CLIENT_URL = https://lifexp-frontend.onrender.com
   ```
4. Service will auto-redeploy

## ✅ Step 5: Test Your Deployment

1. Open your frontend URL: `https://lifexp-frontend.onrender.com`
2. Try to **Sign Up** with a new account
3. **Log In** with your account
4. **Create a habit** and mark it complete
5. **Add a todo** task
6. **Write a journal entry**
7. Check that **streak calendar** updates

## 🐛 Troubleshooting

### Backend Issues:
- **500 Errors**: Check Render logs → Go to backend service → "Logs" tab
- **Database Connection Failed**: Verify your Neon credentials (PGHOST, PGDATABASE, PGUSER, PGPASSWORD) are correct
- **Tables don't exist**: Run SQL scripts in your Neon database using Neon's SQL Editor

### Frontend Issues:
- **Can't connect to API**: Check VITE_API_URL in frontend environment variables
- **CORS errors**: Verify CLIENT_URL in backend matches your frontend URL exactly
- **Build fails**: Check build logs for missing dependencies

### Free Tier Limitations:
- ⚠️ **Render Backend sleeps after 15 min of inactivity** - First request takes ~30 seconds
- ⚠️ **Neon Free tier**: 0.5GB storage, compute scales to zero after 5 min inactivity
- ⚠️ **Services may restart periodically**

**💡 Benefit of using Neon**: Your database persists independently of Render, making it easier to migrate or use with multiple services!

## 🔄 Updating Your App

After making code changes:

```bash
# Commit and push changes
git add .
git commit -m "Update feature"
git push origin main
```

Render will **automatically redeploy** both frontend and backend!

## 📊 Database Backup (Important!)

**If using Neon**: Backups are included in Neon's free tier! Check your Neon dashboard for restore options.

**If using Render database**: Free tier databases are not automatically backed up:

1. Go to your database on Render
2. Click **"Connect"** → Use external connection
3. Use `pg_dump` to backup:
   ```bash
   pg_dump -h <host> -U <user> -d <database> > backup.sql
   ```

## 🎉 Success!

Your LifeXP app is now live on Render! Share your frontend URL with others.

**Frontend**: `https://lifexp-frontend.onrender.com`  
**Backend API**: `https://lifexp-backend.onrender.com`

---

## 📝 Quick Reference

### SQL Files to Run (in order):
1. `server/database/create_users_table.sql`
2. `server/database/create_habits_table.sql`
3. `server/database/create_habit_logs_table.sql`
4. `server/database/create_daily_stats_table.sql`
5. `server/database/create_todos_table.sql`
6. `server/database/create_journal_entries_table.sql`

### Environment Variables:

**Backend**:
- NODE_ENV
- PORT
- JWT_SECRET
- CLIENT_URL
- PGHOST
- PGDATABASE
- PGUSER
- PGPASSWORD

**Frontend**:
- VITE_API_URL

---

**Need help?** Check Render docs: https://render.com/docs
