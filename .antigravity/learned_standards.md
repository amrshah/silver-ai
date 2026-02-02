# Learned Standards - Silver AI

## 1. Architectural Stack
- **Backend**: Laravel 11 (PHP 8.2+).
- **Frontend**: Next.js 14+ (App Router).
- **Database**: SQLite (Local development).
- **Branding**: Silver AI Hub (Enterprise Intelligence Suite).
- **Styling**: Tailwind CSS (Dark theme: `#0f0f0f`).
- **Icons**: Lucide React.
- **Infrastructure**: Dockerized (Docker Compose).

## 2. Coding Patterns (Fingerprint)
### Backend (Laravel)
- **Controller-Service Pattern**: Business logic is decoupled from controllers into Services (e.g., `SilverAIService`).
- **Response Format**: Strict JSON API responses.
- **Auth**: Laravel Sanctum for token-based authentication.
- **Naming**: `PascalCase` for classes, `camelCase` for methods/variables, `snake_case` for database columns.

### Frontend (Next.js)
- **Component Factorization**: Components are modularized in `src/components`.
- **State Management**: React `useState` and `useEffect` are primary; state is often synced with URL query parameters for bookmarkability and history support.
- **API Communication**: Centralized in `src/services/aiGatewayService.ts`.
- **Aesthetics**: Premium, dark-mode focused, clear typography, and subtle micro-animations (e.g., Lucide icons, hover effects).

## 3. Deployment & Environment
- **Docker**: Each service has its own `Dockerfile`. Root `docker-compose.yml` orchestrates them.
- **Environment**: `.env` files manage sensitive configuration (API keys for Cloudflare, account IDs).

## 4. Development Workflow
- **State Persistence**: A `PLAN.md` exists in the root to track migration and development progress.
- **RBAC**: Handled by `amrshah/laravel-arbac` on the backend.
- **SEO/Privacy**: Global `noindex` policy enforced via `robots.txt` and meta tags.
- **Demo Access**: One-click demo accounts provided for rapid intelligence suite exploration.
