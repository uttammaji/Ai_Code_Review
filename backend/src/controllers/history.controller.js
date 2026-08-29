// Copy the code above for history.controller.js
// backend/src/controllers/history.controller.js
import History from '../models/History.js';
import Project from '../models/Project.js';

// Get all history entries for a user
export const getHistory = async(req, res) => {
    try {
        const history = await History.find({ userId: req.user._id })
            .populate('projectId', 'name')
            .populate('reviewId', 'score status')
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Get history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch history',
            error: error.message
        });
    }
};

// Get history entry by ID
export const getHistoryById = async(req, res) => {
    try {
        const { id } = req.params;

        const history = await History.findOne({
                _id: id,
                userId: req.user._id
            })
            .populate('projectId', 'name description')
            .populate('reviewId', 'score status issues');

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'History entry not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Get history by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch history entry',
            error: error.message
        });
    }
};

// Get history entries by project
export const getHistoryByProject = async(req, res) => {
    try {
        const { projectId } = req.params;

        const history = await History.find({
                projectId: projectId,
                userId: req.user._id
            })
            .populate('projectId', 'name')
            .populate('reviewId', 'score status')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Get history by project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch project history',
            error: error.message
        });
    }
};

// Create a new history entry (used by other controllers)
export const createHistory = async(projectId, reviewId, action, details, userId) => {
    try {
        const history = new History({
            projectId,
            reviewId,
            userId,
            action,
            details: details || {}
        });

        await history.save();
        return history;
    } catch (error) {
        console.error('Create history error:', error);
        return null;
    }
};

export default {
    getHistory,
    getHistoryById,
    getHistoryByProject,
    createHistory
};