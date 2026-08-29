// backend/src/middleware/error.middleware.js

// 404 Not Found handler
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default { notFound, errorHandler };
