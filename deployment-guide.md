# Silver AI | Deployment Guide

This guide outlines the steps required to deploy the Silver AI ecosystem (Laravel Backend & Next.js Frontend) to a production environment.

---

## 1. Google Cloud Console Setup (Prerequisite)

Before deploying, you must configure Google OAuth for the "Corporate Google Account" login feature.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project named **Silver AI**.
3.  Navigate to **APIs & Services > OAuth consent screen**.
    *   User Type: **External** (if allowing any corporate account) or **Internal** (if restricted to your workspace).
    *   Add your app name, support email, and developer contact info.
4.  Navigate to **APIs & Services > Credentials**.
5.  Click **Create Credentials > OAuth client ID**.
    *   Application type: **Web application**.
    *   **Authorized JavaScript origins**: `https://your-frontend-domain.com`
    *   **Authorized redirect URIs**: `https://your-backend-domain.com/api/auth/google/callback`
6.  Copy your **Client ID** and **Client Secret**.

---

## 2. Backend Deployment (Laravel - Hostinger VPS)

*Recommended OS: Ubuntu 22.04 LTS with Nginx.*

### Step 1: Clone and Install
```bash
git clone -b main https://github.com/your-repo/silver-ai.git
cd silver-ai/laravel-backend
composer install --optimize-autoloader --no-dev
```

### Step 2: Configure Environment
Copy `.env.example` to `.env` and update the following:
```env
APP_NAME="Silver AI Core"
APP_ENV=production
APP_KEY=base64:... # Generate using: php artisan key:generate

# Database (Hostinger MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=silver_ai_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# AI & Google Auth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-domain.com/api/auth/google/callback

# Sanction & CORS
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.your-frontend-domain.com
```

### Step 3: Database & Permissions
```bash
php artisan migrate --force
php artisan db:seed --class=DatabaseSeeder
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data .
```

---

## 3. Frontend Deployment (Next.js - Cloudflare Pages)

Cloudflare Pages is recommended for the Elara Intelligence Suite due to its edge performance.

1.  Connect your GitHub repository to **Cloudflare Pages**.
2.  Set the **Build command**: `npm run build`
3.  Set the **Build directory**: `.next`
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: `https://your-backend-domain.com/api`

---

## 4. Final Verification

1.  **CORS Check**: Ensure `laravel-backend/config/cors.php` includes your frontend domain in the `allowed_origins` array.
2.  **Sanctum**: Ensure the frontend is sending the `Authorization: Bearer [token]` header (this is handled automatically by `aiGatewayService.ts`).
3.  **Favicon**: Verify that the browser tab shows the Silver Ant icon (updated in `src/app/layout.tsx`).

---

## Technical Support
For environment-specific issues, contact the AI Engineering team at Silver Ant Marketing.
