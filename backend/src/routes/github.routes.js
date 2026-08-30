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

// OAuth routes
router.get('/auth', githubAuth);
router.get('/callback', githubOAuthCallback);

// Protected routes
router.post('/connect', protect, connectGitHub);
router.get('/user', protect, getGitHubUser);
router.get('/repos', protect, getGithubRepos);
router.delete('/disconnect', protect, disconnectGitHub);

export default router;
