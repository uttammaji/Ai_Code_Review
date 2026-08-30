import express from 'express';

const router = express.Router();

// Simple test route - no dependencies
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'GitHub routes are working!',
        timestamp: new Date().toISOString()
    });
});

router.get('/auth', (req, res) => {
    res.json({ success: true, message: 'Auth endpoint' });
});

router.post('/connect', (req, res) => {
    res.json({ success: true, message: 'Connect endpoint' });
});

router.get('/user', (req, res) => {
    res.json({ success: true, user: null });
});

router.get('/repos', (req, res) => {
    res.json({ success: true, repositories: [] });
});

router.delete('/disconnect', (req, res) => {
    res.json({ success: true, message: 'Disconnected' });
});

export default router;
