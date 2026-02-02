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
    *   **Authorized redirect URIs**: `https://elara.silverantacademy.com/api/auth/google/callback`
6.  Copy your **Client ID** and **Client Secret**.

---

## 2. Backend Deployment (Laravel - Hostinger Shared Hosting)

Shared hosting requires a specific directory structure. We will place the core files in a private folder and the public files in `public_html`.

### Step 1: Uploading Files
1.  Compress all files in `laravel-backend/` (except `vendor`, `node_modules`, and `.env`).
2.  In Hostinger's **File Manager**, create a folder named `silver_backend` in the root directory (one level *above* `public_html`).
3.  Upload and extract your files into `silver_backend`.
4.  Move everything inside `silver_backend/public/` into your `public_html` folder.

### Step 2: Fix Path Mapping
Edit `public_html/index.php` and update these two lines (approx. lines 34 and 47) to point to your private folder:
```php
// Old: 
// require __DIR__.'/../vendor/autoload.php';
// $app = require_once __DIR__.'/../bootstrap/app.php';

// New:
require __DIR__.'/../silver_backend/vendor/autoload.php';
$app = require_once __DIR__.'/../silver_backend/bootstrap/app.php';
```

### Step 3: Configure Environment
1.  Create a MySQL Database in **Hostinger hPanel > Databases**.
2.  Copy your `.env` content to `silver_backend/.env` and update the `DB_` credentials with the ones Hostinger provided.
3.  Ensure `APP_URL` is set to `https://elara.silverantacademy.com`.
4.  Set `GOOGLE_REDIRECT_URI` to `https://elara.silverantacademy.com/api/auth/google/callback`.

### Step 4: Run Commands via SSH
1.  Enable **SSH Access** in your Hostinger hPanel.
2.  Connect via Terminal: `ssh your_username@server_ip`
3.  Navigate to the folder: `cd silver_backend`
4.  Run optimizations:
```bash
/usr/local/bin/composer install --no-dev # Hostinger uses full path for composer
php artisan migrate --force
php artisan db:seed --class=DatabaseSeeder
php artisan config:cache
```

### Step 5: Storage Symlink
Since you can't run `php artisan storage:link` easily to the `public_html` folder, create a simple route or a PHP script to run `symlink('/home/user/silver_backend/storage/app/public', '/home/user/public_html/storage');`.

---

## 3. Frontend Deployment (Next.js at /app)

To serve the Next.js app at `https://elara.silverantacademy.com/app` on shared hosting:

### Step 1: Configure basePath
I have updated your `next.config.ts` with `basePath: '/app'`. This ensures all internal links and assets are prefixed correctly.

### Step 2: Build and Upload
1.  Run `npm run build` locally.
2.  If you are using static export (`output: 'export'`), upload the contents of `out/` to a folder named `app` inside your `public_html`.
3.  If you are using a Node.js server (Hostinger Node.js selector), follow Hostinger's guide to point the site to the subpath.

### Step 3: API Connection
*   `NEXT_PUBLIC_API_URL`: `https://elara.silverantacademy.com/api`

---

## 4. Final Verification

1.  **CORS Check**: Ensure `laravel-backend/config/cors.php` includes `https://elara.silverantacademy.com`.
2.  **Sanctum**: Ensure the frontend is sending the `Authorization: Bearer [token]` header (this is handled automatically by `aiGatewayService.ts`).
3.  **Google Callback**: The Google console redirect MUST match: `https://elara.silverantacademy.com/api/auth/google/callback`.

---

## Technical Support
For environment-specific issues, contact the AI Engineering team at Silver Ant Marketing.
