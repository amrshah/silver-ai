# Conversion Plan: PHP to Laravel API & Next.js

## Overview
This plan outlines the steps to migrate the current Silver AI PHP codebase into a modern stack using Laravel (Backend API) and Next.js (Frontend).

## 1. Backend: Laravel APIs (`/laravel-backend`)
### Goal: Convert existing PHP logic and SQLite database into a robust Laravel API.

- **Initialization** (Completed):
  - Install Laravel 11 in `laravel-backend`.
  - Configure for API-focused development (Sanctum/Socialite for Auth).
  - Install and configure `amrshah/laravel-arbac` for RBAC.
- **RBAC Setup** (Completed):
  - Implement roles: `root` (full system access), `super admin`, `manager`, and `user`.
- **Database Logic** (Completed):
  - Create Migrations for `users`, `threads`, and `messages` (based on `database.sql`).
  - Set up Eloquent Models with relationships.
- **AI Service Integration** (Completed):
  - Create `App\Services\SilverAIService` to handle Cloudflare Workers AI communication.
- **API Endpoints** (Completed):
  - `GET /api/chat/threads`: List user message threads.
  - `POST /api/chat/ask`: Send prompt to AI and store history.
  - `GET /api/chat/threads/{id}`: Fetch chat history.
  - `DELETE /api/chat/threads/{id}`: Delete thread.

## 2. Frontend: React/Next.js (`/nextjs-app`)
### Goal: Rewrite/Upgrade the current Vite-based frontend to Next.js for better routing and performance.

- **Initialization** (Completed):
  - Create a new Next.js project using `npx create-next-app`.
- **UI Migration** (Completed):
  - Port components from `nextjs-frontend/components/` to the new Next.js architecture (App Router).
- **API Connectivity** (Completed):
  - Update `services/aiGatewayService.ts` to connect to Laravel APIs.

## 3. Post-Migration
- [ ] Test all AI features through the Next.js app.
- [ ] Verify thread persistence in the Laravel SQLite database.
- [ ] (Optional) Cleanup old `public/`, `SilverAI.php`, and `nextjs-frontend/` folders.

## 3. Migration Steps
1.  **Backend Setup**: Initialize Laravel and create migrations.
2.  **Core Logic Porting**: Move AI calling logic to a Laravel Service.
3.  **Frontend Setup**: Initialize Next.js.
4.  **Component Porting**: Move and adapt existing React components.
5.  **Integration**: Connect Next.js to Laravel APIs.
6.  **Cleanup**: Verify all features work and move old php code to _legacy folder.

---
**Next Steps**: I will begin by initializing the Laravel backend in the `laravel-backend` directory.
