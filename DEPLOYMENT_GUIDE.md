# Real Estate Calculator - Deployment Guide

## 📋 Prerequisites

- Supabase account with database already set up
- Web hosting (Netlify, Vercel, or traditional hosting with cPanel)
- FTP client (for traditional hosting) or GitHub account (for Netlify/Vercel)

## 🗄️ Database Setup (Already Complete)

Your Supabase database is already configured with:
- ✅ All tables created (users, services, regions, currencies, pricing_factors, quotes, audit_logs)
- ✅ Row Level Security policies
- ✅ Initial data seeded (7 services, 7 regions, 6 currencies)
- ✅ Database URL: `https://ucpsgvemgvfaggmnshag.supabase.co`

## 👤 Create Admin User

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** or **Invite User**
4. Enter:
   - Email: `admin@calculator.com`
   - Password: `Admin@123` (or your choice)
   - Auto Confirm User: **YES**
5. Click **Create User**

6. **Promote to Admin** - Run this SQL in SQL Editor:
   ```sql
   SELECT setup_admin_user('admin@calculator.com');
   ```

## 🚀 Deployment Methods

### Method 1: Netlify (Recommended - Easiest)

#### Option A: Drag & Drop

1. **Download the `dist` folder** from your project
2. Go to https://app.netlify.com/drop
3. **Drag the `dist` folder** into the drop zone
4. Once deployed, go to **Site Settings** → **Environment Variables**
5. Add these variables:
   ```
   VITE_SUPABASE_URL=https://ucpsgvemgvfaggmnshag.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHNndmVtZ3ZmYWdnbW5zaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTcyNjQsImV4cCI6MjA4MTgzMzI2NH0.Ottc2XebtASQou-8zXtn3OCItR-t72MnfYdQFxO6lV4
   ```
6. **Redeploy** the site after adding environment variables

#### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to Netlify → **Add New Site** → **Import from Git**
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables (same as above)
6. Deploy

### Method 2: Vercel

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Framework: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://ucpsgvemgvfaggmnshag.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHNndmVtZ3ZmYWdnbW5zaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTcyNjQsImV4cCI6MjA4MTgzMzI2NH0.Ottc2XebtASQou-8zXtn3OCItR-t72MnfYdQFxO6lV4
   ```
8. Deploy

### Method 3: Traditional Web Hosting (cPanel/Shared Hosting)

#### Step 1: Prepare Files

1. Build the project locally:
   ```bash
   npm install
   npm run build
   ```

2. The `dist` folder contains your production files

#### Step 2: Upload to Hosting

1. Connect via FTP (FileZilla, Cyberduck, or cPanel File Manager)
2. Upload **all contents of the `dist` folder** to your `public_html` directory
3. Ensure `.htaccess` file is uploaded (enables SPA routing)

#### Step 3: Configure Environment Variables

Since traditional hosting doesn't have environment variables, you need to **hardcode** them in the built files OR use a different approach:

**Option A: Use a config file**

Create `config.js` in your `public_html`:
```javascript
window.ENV = {
  VITE_SUPABASE_URL: 'https://ucpsgvemgvfaggmnshag.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHNndmVtZ3ZmYWdnbW5zaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTcyNjQsImV4cCI6MjA4MTgzMzI2NH0.Ottc2XebtASQou-8zXtn3OCItR-t72MnfYdQFxO6lV4'
};
```

And include it in `index.html` BEFORE the main script:
```html
<script src="/config.js"></script>
```

**Option B: Rebuild with hardcoded values** (Not recommended for security)

Edit `.env` file before building:
```
VITE_SUPABASE_URL=https://ucpsgvemgvfaggmnshag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHNndmVtZ3ZmYWdnbW5zaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTcyNjQsImV4cCI6MjA4MTgzMzI2NH0.Ottc2XebtASQou-8zXtn3OCItR-t72MnfYdQFxO6lV4
```

Then build: `npm run build`

#### File Structure on Server

```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

## 🔍 Verify Deployment

1. Visit your site URL
2. You should see the homepage
3. Click **"Get Started"** to access calculator
4. Click **"Admin Login"** to test login with your admin credentials

## 🔐 Login Credentials

After creating admin user:
- **Email**: `admin@calculator.com` (or what you set)
- **Password**: `Admin@123` (or what you set)
- **URL**: `https://your-domain.com/login`

## 📁 Files You Need to Upload (Traditional Hosting)

Upload **all files from the `dist` folder**:

```
✅ index.html (main HTML file)
✅ .htaccess (URL rewriting for SPA)
✅ assets/index-[hash].css (styles)
✅ assets/index-[hash].js (JavaScript bundle)
✅ Any other asset files
```

**Important**: Make sure `.htaccess` is uploaded! It's a hidden file and crucial for routing to work.

## 🐛 Troubleshooting

### Issue: "Page not found" when refreshing on any route except home

**Solution**: Ensure `.htaccess` file exists and mod_rewrite is enabled on your server

### Issue: "Cannot connect to Supabase" or authentication errors

**Solution**:
1. Check environment variables are set correctly
2. Verify Supabase URL and Anon Key
3. Check browser console for specific errors

### Issue: Admin login not working

**Solution**:
1. Verify you created the user in Supabase Dashboard
2. Confirm you ran the `setup_admin_user()` SQL function
3. Check that auto-confirm user was enabled

### Issue: Calculator not showing prices

**Solution**:
1. Verify database has seeded data (services, regions, currencies, pricing_factors)
2. Check browser console for API errors
3. Ensure RLS policies are properly configured

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify Supabase connection in Network tab
3. Check SQL logs in Supabase Dashboard → Logs

## 🎉 Success Checklist

- ✅ Files uploaded to hosting
- ✅ Environment variables configured
- ✅ Admin user created and promoted
- ✅ Homepage loads correctly
- ✅ Calculator page works
- ✅ Admin login successful
- ✅ Admin dashboard accessible

Your Real Estate Project Pricing Calculator is now live!
