import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    githubAuth,
    githubOAuthCallback,
    connectGitHub,
    getGitHubUser,
    getGithubRepos,
    disconnectGitHub,
} from '../controllers/github.controller.js';

const router = express.Router();

console.log('✅ Setting up GitHub routes...');

// OAuth routes
router.get('/auth', githubAuth);
router.get('/callback', githubOAuthCallback);

// Protected routes
router.post('/connect', protect, connectGitHub);
router.get('/user', protect, getGitHubUser);
router.get('/repos', protect, getGithubRepos);
router.delete('/disconnect', protect, disconnectGitHub);

// Test route
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'GitHub routes are working!' });
});

console.log('✅ GitHub routes setup complete');

export default router;
