import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import reviewRoutes from './routes/review.routes.js';
import historyRoutes from './routes/history.routes.js';
import githubRoutes from './routes/github.routes.js';

import {
    notFound,
    errorHandler,
} from './middleware/error.middleware.js';

import {
    apiLimiter,
} from './middleware/rateLimit.middleware.js';

const app = express();

// Security
app.use(helmet());

// Flexible CORS configuration for Local, Vercel, and Custom Domains
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''));

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Check if origin is in explicit allowed list
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }

        // Allow any Vercel deployment preview domain for this project
        if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
            return callback(null, true);
        }

        return callback(null, true); // Permissive fallback for seamless client connections
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parser
app.use(
    express.json({
        limit: '5mb',
    })
);

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoints
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'AI Code Review API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/github', githubRoutes);

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;