# HospAI Backend API (`hms-api`)

Backend API service bridging the HospAI Landing Page (`hms_landing_page`) and Command Center (`hms_command_center`) with a shared PostgreSQL database. Built with Node.js 20+, TypeScript, Express, `pg`, and `zod`.

---

## Features

- **Public Submission**: Secure, rate-limited endpoint for demo booking requests with strict Zod validation.
- **Protected Internal API**: Command Center routes secured with Bearer token authentication evaluated in constant time using `crypto.timingSafeEqual` to thwart timing attacks.
- **Privacy & Security**:
  - Request bodies are never logged.
  - Strict 50KB request body size limit.
  - Helmet security headers and CORS protection strictly restricted to configured origins.
  - Parameterized SQL queries preventing SQL injection vulnerabilities.
  - Least-privilege database role `hms_api` definition preventing runtime superuser access.

---

## Project Structure

```
hms-api/
├── migrations/
│   └── 001_demo_requests.sql   # PostgreSQL table, index, and limited role creation
├── src/
│   ├── db.ts                   # PostgreSQL Pool configuration (SSL in production)
│   ├── migrate.ts              # Migration execution runner script
│   └── server.ts               # Express API endpoints and middlewares
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules (.env, node_modules, dist)
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript strict configuration
└── README.md                   # Documentation and curl examples
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Example / Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. | `postgresql://hms_api:password@localhost:5432/hms_db` |
| `PORT` | Port the API server listens on. | `4000` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins. | `http://localhost:5173,http://localhost:8443` |
| `COMMAND_CENTER_KEY` | Secret token required for protected routes via `Authorization: Bearer <KEY>`. | `change-this-secret-in-production` |
| `NODE_ENV` | Application environment (`development` or `production`). In production, SSL is strictly enforced. | `development` |

---

## Database Migration

Run the migration script to create the `demo_requests` table, indexes, and the limited `hms_api` role:

```bash
npm run migrate
```

Alternatively, you can apply `migrations/001_demo_requests.sql` directly using `psql`:

```bash
psql "$DATABASE_URL" -f migrations/001_demo_requests.sql
```

> **Security Note:** In production, do not run application code with the PostgreSQL superuser (`postgres`). Connect with the restricted `hms_api` role, which only possesses permissions for `SELECT`, `INSERT`, and `UPDATE(status)` on `demo_requests`.

---

## Scripts

- `npm run dev` - Starts development server with hot reloading (`tsx watch --env-file=.env src/server.ts`).
- `npm run start` - Runs the API server directly with `tsx`.
- `npm run migrate` - Runs the database migration against `DATABASE_URL`.
- `npm run build` - Compiles TypeScript to `dist/` with strict mode enabled.

---

## API Endpoints & `curl` Examples

### 1. Health Check (`GET /health`)
- **Access**: Public
```bash
curl -i http://localhost:4000/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-10-15T05:03:09.734Z"
}
```

---

### 2. Submit Demo Request (`POST /api/demo-requests`)
- **Access**: Public (Rate-limited: 10 requests / 15 minutes per IP)
- **Validation**:
  - `fullName`: string (required)
  - `workEmail`: valid email string (required)
  - `phone`: regex `/^[\d\s+\-()]{7,18}$/` (required)
  - `hospitalName`: string (required)
  - `preferredDate`: date in `YYYY-MM-DD` format (required)
  - `preferredTime`: string (required)
  - `designation`, `location`, `bedCount`, `message`: optional strings
  - `interests`: array of strings

```bash
curl -i -X POST http://localhost:4000/api/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Sarah Jenkins",
    "workEmail": "s.jenkins@stjude-health.org",
    "phone": "+1 (555) 432-8765",
    "hospitalName": "St. Jude Medical Center",
    "designation": "Chief Information Officer",
    "location": "Chicago, IL",
    "bedCount": "101–250",
    "interests": ["Complete HospAI", "Emergency", "Inpatient & Beds"],
    "preferredDate": "2026-11-25",
    "preferredTime": "02:30 PM",
    "message": "Interested in clinical AI workflow pilots."
  }'
```

**Response (201 Created):**
```json
{
  "requestId": "HOSPAI-DEMO-00002"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "workEmail": ["Enter a valid email address"],
    "preferredDate": ["Preferred date must be in YYYY-MM-DD format"]
  }
}
```

---

### 3. List Demo Requests (`GET /api/demo-requests`)
- **Access**: Protected (`Authorization: Bearer <COMMAND_CENTER_KEY>`)
- **Query Parameters**:
  - `status`: optional filter (`new`, `contacted`, `scheduled`, `completed`, `cancelled`)
  - `limit`: optional (max 200, default 50)
  - `offset`: optional (default 0)

```bash
curl -i http://localhost:4000/api/demo-requests?status=new&limit=20 \
  -H "Authorization: Bearer change-this-secret-in-production"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "2",
      "request_id": "HOSPAI-DEMO-00002",
      "full_name": "Dr. Sarah Jenkins",
      "work_email": "s.jenkins@stjude-health.org",
      "phone": "+1 (555) 432-8765",
      "hospital_name": "St. Jude Medical Center",
      "preferred_time": "02:30 PM",
      "designation": "Chief Information Officer",
      "location": "Chicago, IL",
      "bed_count": "101–250",
      "message": "Interested in clinical AI workflow pilots.",
      "interests": ["Complete HospAI", "Emergency", "Inpatient & Beds"],
      "preferred_date": "2026-11-25",
      "status": "new",
      "created_at": "2026-10-15T05:15:00.000Z"
    }
  ],
  "limit": 20,
  "offset": 0,
  "count": 1
}
```

---

### 4. Update Request Status (`PATCH /api/demo-requests/:requestId`)
- **Access**: Protected (`Authorization: Bearer <COMMAND_CENTER_KEY>`)
- **Body**: `{ "status": "contacted" | "scheduled" | "completed" | "cancelled" | "new" }`

```bash
curl -i -X PATCH http://localhost:4000/api/demo-requests/HOSPAI-DEMO-00002 \
  -H "Authorization: Bearer change-this-secret-in-production" \
  -H "Content-Type: application/json" \
  -d '{"status": "scheduled"}'
```

**Response (200 OK):**
```json
{
  "message": "Status updated successfully",
  "data": {
    "id": "2",
    "request_id": "HOSPAI-DEMO-00002",
    "full_name": "Dr. Sarah Jenkins",
    "status": "scheduled",
    "..." : "..."
  }
}
```
