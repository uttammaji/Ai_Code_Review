// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import reviewRoutes from './routes/review.routes.js';
import historyRoutes from './routes/history.routes.js';
import githubRoutes from './routes/github.routes.js';

import { notFound, errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';



const app = express();
app.use(express.json({ limit: '5mb' }));
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable CSP for API
}));

// Logging
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''));

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // Check if origin is in explicit allowed list
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        
        // Allow any Vercel deployment preview domain
        if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Permissive fallback for development
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS requests (preflight)
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(204);
    }
    next();
});

// Body parser

app.use(express.urlencoded({ extended: true }));

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

// 404 handler
app.use(notFound);

// Global error handler - MUST be last
app.use(errorHandler);

export default app;
