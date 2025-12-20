#!/bin/bash

# Real Estate Calculator - Create Deployment Package
# This script creates a zip file with all necessary files for deployment

echo "🎯 Creating deployment package..."

# Create a temporary directory
DEPLOY_DIR="real-estate-calculator-deploy"
mkdir -p "$DEPLOY_DIR"

echo "📦 Copying built files..."

# Copy dist folder contents (including hidden files)
shopt -s dotglob
cp -r dist/* "$DEPLOY_DIR/" 2>/dev/null
shopt -u dotglob

# Copy documentation
echo "📄 Copying documentation..."
cp README.md "$DEPLOY_DIR/"
cp DEPLOYMENT_GUIDE.md "$DEPLOY_DIR/"
cp HOW_TO_DOWNLOAD.md "$DEPLOY_DIR/"

# Create environment template
echo "⚙️ Creating environment template..."
cat > "$DEPLOY_DIR/ENV_INSTRUCTIONS.txt" << 'EOF'
ENVIRONMENT VARIABLES
=====================

For Netlify/Vercel, add these to your hosting dashboard:

VITE_SUPABASE_URL=https://ucpsgvemgvfaggmnshag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHNndmVtZ3ZmYWdnbW5zaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTcyNjQsImV4cCI6MjA4MTgzMzI2NH0.Ottc2XebtASQou-8zXtn3OCItR-t72MnfYdQFxO6lV4

For traditional hosting (cPanel/FTP):
These are already built into the JavaScript bundle!
Just upload the files and they will work.

ADMIN USER SETUP
=================

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Authentication → Users → Add User
3. Email: admin@calculator.com
4. Password: Admin@123
5. Run SQL: SELECT setup_admin_user('admin@calculator.com');
6. Login at: https://your-domain.com/login

EOF

# Create deployment instructions
echo "📋 Creating quick start guide..."
cat > "$DEPLOY_DIR/QUICK_START.txt" << 'EOF'
REAL ESTATE CALCULATOR - QUICK START
=====================================

🎯 WHAT TO UPLOAD:

Upload ALL files in this folder to your web hosting:

For cPanel/FTP:
---------------
Upload everything to public_html/

File structure should be:
public_html/
├── index.html
├── .htaccess  ⚠️ IMPORTANT (hidden file)
└── assets/
    ├── index-[hash].css
    └── index-[hash].js


For Netlify:
------------
1. Go to https://app.netlify.com/drop
2. Drag THIS ENTIRE FOLDER into the drop zone
3. Add environment variables (see ENV_INSTRUCTIONS.txt)


For Vercel:
-----------
1. Push to GitHub
2. Import to Vercel
3. Build command: npm run build
4. Output: dist
5. Add environment variables (see ENV_INSTRUCTIONS.txt)


📝 AFTER DEPLOYMENT:

1. Visit your website
2. Create admin user (see ENV_INSTRUCTIONS.txt)
3. Login at /login
4. Access admin dashboard at /admin


🆘 NEED HELP?

Read: DEPLOYMENT_GUIDE.md (detailed instructions)
Read: HOW_TO_DOWNLOAD.md (deployment options)
Read: README.md (project overview)


✅ CHECKLIST:

□ All files uploaded
□ .htaccess included (for routing)
□ Admin user created in Supabase
□ Can access homepage
□ Can login to admin
□ Calculator works


🚀 You're ready to go!

EOF

# Create a file list
echo "📝 Creating file list..."
cat > "$DEPLOY_DIR/FILE_LIST.txt" << 'EOF'
DEPLOYMENT PACKAGE CONTENTS
============================

WEB FILES (Upload to public_html/):
├── index.html              Main HTML file
├── .htaccess              URL rewriting config (IMPORTANT!)
└── assets/
    ├── index-*.css        Compiled styles
    └── index-*.js         Compiled JavaScript

DOCUMENTATION:
├── README.md              Project overview
├── DEPLOYMENT_GUIDE.md    Detailed deployment guide
├── HOW_TO_DOWNLOAD.md     Download instructions
├── QUICK_START.txt        Quick deployment steps
├── ENV_INSTRUCTIONS.txt   Environment setup
└── FILE_LIST.txt          This file

IMPORTANT NOTES:
================

1. .htaccess is a HIDDEN file - make sure it's uploaded!
2. Keep the assets/ folder structure intact
3. Environment variables are already built-in for traditional hosting
4. For Netlify/Vercel, add environment variables in dashboard

EOF

# Create zip file
echo "🗜️ Creating zip archive..."
zip -r "${DEPLOY_DIR}.zip" "$DEPLOY_DIR" > /dev/null 2>&1

# Clean up
echo "🧹 Cleaning up..."
rm -rf "$DEPLOY_DIR"

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 File: ${DEPLOY_DIR}.zip"
echo ""
echo "📋 Next steps:"
echo "   1. Download: ${DEPLOY_DIR}.zip"
echo "   2. Extract the zip file"
echo "   3. Read QUICK_START.txt"
echo "   4. Upload files to your hosting"
echo ""
echo "🎉 Ready to deploy!"
