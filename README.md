# Silver AI - Deployment Guide (Hostinger)

This guide details how to deploy the Silver AI chat application to a production environment like Hostinger, ensuring security by keeping sensitive configuration files outside the public web root.

## 1. Prerequisites

Before deploying, ensure you have:
*   **Hostinger Account** with PHP 8.1+ enabled.
*   **Google Cloud Console Project** with OAuth enabled (Client ID & Secret).
*   **Cloudflare Account** with AI Gateway and Workers AI enabled (Account ID & Token).

## 2. Prepare Local Files

1.  **Dependencies**: Run `composer install --no-dev` in your project root to ensure all PHP dependencies are ready and optimized.
2.  **Clean Up**: Delete any `silver_debug.log` files or testing databases (`silver.db` will be recreated or you can upload your local one if you want to keep users).
3.  **Zip Project**: Compress the entire `silver-ai` folder into a ZIP file.

## 3. Upload to Hostinger

Hostinger (and other shared hosts) typically maps your domain to a `public_html` folder. We will upload the core application logic to a protected folder and only expose the `public` directory.

### **Scenario A: Deploying to a Subdomain (Recommended)**
*Example: `chat.yourdomain.com`*

1.  **Create Subdomain**: In Hostinger Dashboard, create a subdomain `chat.yourdomain.com`.
2.  **Custom Document Root**: 
    *   **Crucial Step**: When creating the subdomain (or editing it), set the **Document Root** to `domains/yourdomain.com/public_html/silver-ai/public`.
    *   This ensures that visitors only hit the `public` folder, while your config and logic sit safely one level up in `silver-ai`.
3.  **Upload**:
    *   Go to **File Manager**.
    *   Navigate to `domains/yourdomain.com/public_html/`.
    *   Create a folder named `silver-ai`.
    *   Upload and extract your ZIP content here.
    *   Resulting Structure:
        ```text
        /public_html/silver-ai/
        ├── SilverAI.php
        ├── DB.php
        ├── silver_config.json    <-- SECURE (Cannot be accessed via browser)
        ├── silver.db
        ├── vendor/
        └── public/               <-- WEB ROOT (Visible to public)
            ├── index.php
            ├── assets/
            └── ...
        ```

### **Scenario B: Deploying to a Subfolder**
*Example: `yourdomain.com/chat`*

If you cannot change the document root, you must rely on `.htaccess` or folder placement to secure files.
1.  Upload the `silver-ai` folder to `public_html/chat`.
2.  **Security Risk**: By default, `yourdomain.com/chat/silver_config.json` might be accessible.
3.  **Fix**: Create a `.htaccess` file in `public_html/chat/` (the parent folder) with the following content:
    ```apache
    <FilesMatch "\.(json|db|php|log)$">
        Order Allow,Deny
        Deny from all
    </FilesMatch>
    <FilesMatch "^(index\.php|callback\.php|chat-handler\.php|logout\.php)$">
        Order Allow,Deny
        Allow from all
    </FilesMatch>
    ```
    *Note: Scenario A is much safer and preferred.*

## 4. Permissions (Important!)

SQLite requires write permissions to both the **database file** AND the **directory** containing it.

1.  In Hostinger File Manager, right-click the `silver-ai` folder.
2.  Select **Permissions**.
3.  Ensure it is set to **755** (Owner: Read/Write/Execute).
4.  Ensure `silver.db` is set to **644** or **664**.

## 5. Configuration Updates

1.  **Edit `silver_config.json`** on the server:
    *   Replace `YOUR_GOOGLE_CLIENT_ID` with your production Google Client ID.
    *   Replace `YOUR_GOOGLE_CLIENT_SECRET` with your production Secret.
    *   Ensure your Cloudflare keys are correct.

2.  **Update Google Cloud Console**:
    *   Go to APIs & Services > Credentials > Your OAuth Client.
    *   Add your production URI to **Authorized Redirect URIs**:
        *   If using Subdomain: `https://chat.yourdomain.com/callback.php`
        *   If using Subfolder: `https://yourdomain.com/silver-ai/public/callback.php`

## 6. Troubleshooting

*   **"Database is locked" or "Read-only file system"**: exact check Step 4. The PHP process needs to create temporary `.wal` or `.journal` files next to `silver.db`.
*   **"Class 'Google\Client' not found"**: Ensure the `vendor` folder was uploaded successfully.
*   **"CF Error"**: Check `silver-ai/silver_debug.log` (if enabled) or verify Cloudflare tokens.
