import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import { z } from 'zod';
import { pool } from './db.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Security headers
app.use(helmet());

// Enforce body size limit of 50kb
app.use(express.json({ limit: '50kb' }));

// CORS configuration based on ALLOWED_ORIGINS
const rawAllowedOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawAllowedOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like curl, server-to-server, health probes)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Never log request bodies for privacy and security.
// Only log basic metadata in non-production environments if needed.
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Rate limiting for public demo request submissions: 10 requests per 15 mins per IP
const demoRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many demo requests submitted from this IP. Please try again after 15 minutes.' },
});

// Timing-safe Bearer Token Authentication Middleware
const requireCommandCenterAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const expectedKey = process.env.COMMAND_CENTER_KEY;

  if (!authHeader || !authHeader.startsWith('Bearer ') || !expectedKey) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    return;
  }

  const token = authHeader.slice(7).trim();

  // Hash both token and expectedKey with SHA-256 to ensure matching length
  // and protect against timing attacks
  const tokenHash = crypto.createHash('sha256').update(token).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedKey).digest();

  if (!crypto.timingSafeEqual(tokenHash, expectedHash)) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  next();
};

// Zod Validation Schema for Demo Request Submission
const demoRequestSchema = z.object({
  fullName: z.string({ required_error: 'Full name is required' }).trim().min(1, 'Full name is required').max(200),
  workEmail: z.string({ required_error: 'Work email is required' }).trim().email('Enter a valid email address').max(255),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^[\d\s+\-()]{7,18}$/, 'Enter a valid phone number'),
  hospitalName: z.string({ required_error: 'Hospital name is required' }).trim().min(1, 'Hospital name is required').max(255),
  preferredDate: z
    .string({ required_error: 'Please select a date' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Preferred date must be in YYYY-MM-DD format'),
  preferredTime: z.string({ required_error: 'Please select a time' }).trim().min(1, 'Please select a time').max(50),
  designation: z.string().trim().max(150).optional().nullable(),
  location: z.string().trim().max(255).optional().nullable(),
  bedCount: z.string().trim().max(50).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  version: z.string().trim().max(100).optional().nullable(),
  interests: z.array(z.string().trim().max(100)).default([]),
});

const validStatuses = ['new', 'contacted', 'scheduled', 'completed', 'cancelled'] as const;
type ValidStatus = (typeof validStatuses)[number];

const statusUpdateSchema = z.object({
  status: z.enum(validStatuses, {
    errorMap: () => ({ message: `Status must be one of: ${validStatuses.join(', ')}` }),
  }),
});

/* -------------------------------------------------------------------------- */
/* Endpoints                                                                  */
/* -------------------------------------------------------------------------- */

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/demo-requests (PUBLIC, Rate-limited)
app.post('/api/demo-requests', demoRequestRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const parseResult = demoRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const {
    fullName,
    workEmail,
    phone,
    hospitalName,
    preferredTime,
    designation,
    location,
    bedCount,
    message,
    version,
    interests,
    preferredDate,
  } = parseResult.data;

  // Resolve version: use version or first element of interests
  const resolvedVersion = version || (interests && interests.length > 0 ? interests[0] : null);
  const resolvedInterests = (interests && interests.length > 0)
    ? interests
    : (resolvedVersion ? [resolvedVersion] : []);

  try {
    const insertQuery = `
      INSERT INTO demo_requests (
        full_name,
        work_email,
        phone,
        hospital_name,
        preferred_time,
        designation,
        location,
        bed_count,
        message,
        version,
        interests,
        preferred_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING request_id;
    `;

    const values = [
      fullName,
      workEmail,
      phone,
      hospitalName,
      preferredTime,
      designation || null,
      location || null,
      bedCount || null,
      message || null,
      resolvedVersion,
      resolvedInterests,
      preferredDate,
    ];

    const result = await pool.query<{ request_id: string }>(insertQuery, values);
    const requestId = result.rows[0]?.request_id;

    res.status(201).json({ requestId });
  } catch (error) {
    console.error('Error inserting demo request:', error instanceof Error ? error.message : 'Unknown database error');
    res.status(500).json({ error: 'Failed to save demo request. Please try again later.' });
  }
});

// GET /api/demo-requests (PROTECTED)
app.get('/api/demo-requests', requireCommandCenterAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const statusQuery = req.query.status as string | undefined;
    const limitQuery = Number(req.query.limit) || 50;
    const offsetQuery = Number(req.query.offset) || 0;

    const limit = Math.min(Math.max(1, limitQuery), 200);
    const offset = Math.max(0, offsetQuery);

    let query = `
      SELECT
        id,
        request_id,
        full_name,
        work_email,
        phone,
        hospital_name,
        preferred_time,
        designation,
        location,
        bed_count,
        message,
        version,
        interests,
        preferred_date,
        status,
        created_at
      FROM demo_requests
    `;
    const params: unknown[] = [];

    if (statusQuery) {
      if (!validStatuses.includes(statusQuery as ValidStatus)) {
        res.status(400).json({ error: `Invalid status filter. Allowed values: ${validStatuses.join(', ')}` });
        return;
      }
      params.push(statusQuery);
      query += ` WHERE status = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.status(200).json({
      data: result.rows,
      limit,
      offset,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Error fetching demo requests:', error instanceof Error ? error.message : 'Unknown database error');
    res.status(500).json({ error: 'Failed to retrieve demo requests' });
  }
});

// PATCH /api/demo-requests/:requestId (PROTECTED)
app.patch('/api/demo-requests/:requestId', requireCommandCenterAuth, async (req: Request, res: Response): Promise<void> => {
  const { requestId } = req.params;

  const parseResult = statusUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { status } = parseResult.data;

  try {
    const updateQuery = `
      UPDATE demo_requests
      SET status = $1
      WHERE request_id = $2
      RETURNING
        id,
        request_id,
        full_name,
        work_email,
        phone,
        hospital_name,
        preferred_time,
        designation,
        location,
        bed_count,
        message,
        version,
        interests,
        preferred_date,
        status,
        created_at;
    `;

    const result = await pool.query(updateQuery, [status, requestId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: `Demo request with ID ${requestId} not found` });
      return;
    }

    res.status(200).json({
      message: 'Status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating demo request status:', error instanceof Error ? error.message : 'Unknown database error');
    res.status(500).json({ error: 'Failed to update demo request status' });
  }
});

// Catch-all error handler for CORS or unexpected errors
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error && err.message.includes('CORS')) {
    res.status(403).json({ error: err.message });
    return;
  }
  console.error('Unhandled server error:', err instanceof Error ? err.message : err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`HMS API server listening on http://localhost:${port}`);
});

export default app;
