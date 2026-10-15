# HospAI Landing Page

Interactive landing page and marketing site for HospAI Hospital Management System built with React, TypeScript, Vite, and Tailwind CSS v4.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the backend API (`hms-api`) where demo bookings and inquiries are sent. | `http://localhost:4000` |

### 3. Start Development Server
```bash
npm run dev
```

The app will run at `http://localhost:5173` (or port 8443 if running inside container/preview).

### 4. Production Build
```bash
npm run build
```