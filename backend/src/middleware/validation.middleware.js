// backend/src/middleware/validation.middleware.js
import mongoose from 'mongoose';

// This is the middleware function - it should NOT return another function
export const validateObjectId = (req, res, next) => {
    // req should be defined when used as middleware
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    next();
};

export default { validateObjectId };