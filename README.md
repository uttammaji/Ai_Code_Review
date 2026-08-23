# AI Code Review

AI Code Review is a full-stack web application for performing intelligent code reviews, managing projects, and integrating with GitHub repositories.

The repository contains:
- `backend/` – Express API server with user authentication, project and review management, GitHub integration, and AI-powered code review workflows.
- `frontend/` – React + Vite UI for registration, login, project dashboards, GitHub sync, review history, and more.

## Features

- Email OTP authentication and login flow
- Project creation, editing, and review tracking
- AI-based code review analysis powered by DeepSeek
- GitHub OAuth integration for repository browsing and file review
- Review history and audit trails
- Real-time code editing with Monaco Editor
- Responsive dark theme UI
- Command palette for quick navigation
- Diff viewer for code comparisons

## Technology Stack

### Backend
- Node.js / Express
- MongoDB with Mongoose ODM
- JWT Authentication
- Nodemailer for email OTP
- GitHub OAuth API
- Rate limiting & security middleware

### Frontend
- React 18 with TypeScript
- Vite build tool
- Zustand state management
- React Router v6
- Monaco Editor
- Recharts for analytics
- Tailwind CSS
- Lucide icons

## Prerequisites

- Node.js 18+ / 20+ recommended
- npm or yarn
- MongoDB instance (local or hosted)
- GitHub OAuth App credentials
- Email service credentials (Gmail recommended)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend