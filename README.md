# AI Code Review

AI Code Review is a full-stack web application for performing intelligent code reviews, managing projects, and integrating with GitHub repositories.

The repository contains:
- `backend/` – Express API server with user authentication, project and review management, GitHub integration, and AI-powered code review workflows.
- `frontend/` – React + Vite UI for registration, login, project dashboards, GitHub sync, review history, and more.

## Key Features

- Email OTP authentication and login flow
- Project creation, editing, and review tracking
- AI-based code review analysis
- GitHub OAuth integration for repository browsing and file review
- Review history and audit trails
- Frontend UI built with React, Vite, TypeScript, Zustand, and Monaco editor components

## Repository Structure

- `backend/`
  - `src/` – Express app, routes, controllers, middleware, models, services, and utilities
  - `server.js` – backend entrypoint
  - `Dockerfile` – container build for the backend
- `frontend/`
  - `src/` – React application with pages, components, stores, and API clients
  - `index.html` – app shell
  - `vite.config.ts` – Vite configuration
  - `Dockerfile` – frontend build and Nginx deployment

## Prerequisites

- Node.js 18+ / 20+ recommended
- npm
- MongoDB instance (local or hosted)

## Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on backend environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password_or_app_password
   GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
   GITHUB_REDIRECT_URI=http://localhost:5000/api/github/callback
   DEEPSEEK_API_KEY=your_deepseek_api_key
   DEEPSEEK_MODEL=deepseek-chat
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file (optional) to override the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Running with Docker

### Backend

From `backend/`:
```bash
docker build -t ai-code-review-backend .
docker run -p 5000:5000 --env-file .env ai-code-review-backend
```

### Frontend

From `frontend/`:
```bash
docker build -t ai-code-review-frontend .
docker run -p 80:80 ai-code-review-frontend
```

## API Endpoints

- `POST /api/auth/register` – register user
- `POST /api/auth/verify-otp` – verify registration OTP
- `POST /api/auth/resend-otp` – resend verification OTP
- `POST /api/auth/login` – login with email/password
- `POST /api/auth/login-otp` – route for login email otp verification
- `POST /api/auth/verify-login-otp` – verify login OTP
- `GET /api/auth/me` – get current user
- `POST /api/projects` – create project
- `GET /api/projects` – list user projects
- `POST /api/review/analyze` – run AI code review
- `GET /api/history` – review history
- `POST /api/github/connect` – connect GitHub account
- `GET /api/github/repositories` – list repositories

## Development Notes

- Frontend requests are proxied to the backend using `VITE_API_URL` or the default `/api` base URL.
- Authentication tokens are stored in `localStorage` and sent with requests using the `Authorization` header.
- The backend uses rate limiting, helmet, CORS, JWT auth, and MongoDB for persistence.

## Contact

If you need help configuring GitHub OAuth, MongoDB, or AI integration, check the backend `README.md` inside `backend/` or open an issue in this repository.
