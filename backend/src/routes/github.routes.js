// backend/src/routes/github.routes.js
import express from 'express';

import {
    connectGitHub,
    githubOAuthCallback,
    getGitHubUser,
    getGithubRepos,
    getBranches,
    getRepositoryFiles,
    getRepositoryFile,
    disconnectGitHub,
    reviewRepository,
} from '../controllers/github.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/auth', (req, res) => {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI ;
    
    console.log('🔐 GitHub Auth - Redirect URI:', GITHUB_REDIRECT_URI);
    
    const githubAuthUrl = 
        `https://github.com/login/oauth/authorize?` +
        `client_id=${GITHUB_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&` +
        `scope=repo,user`;

    console.log('🔗 GitHub Auth URL:', githubAuthUrl);
    
    res.redirect(githubAuthUrl);
});

// GitHub OAuth callback
router.get('/callback', githubOAuthCallback);

// ============ PROTECTED ROUTES ============

// Connect GitHub account (save to database)
router.post('/connect', protect, connectGitHub);

// Get GitHub user data
router.get('/user', protect, getGitHubUser);

// Get all repositories (two routes for flexibility)
router.get('/repos', protect, getGithubRepos);
router.get('/repositories', protect, getGithubRepos);

// Get branches for a repository
router.get('/repos/:owner/:repo/branches', protect, getBranches);

// Get repository tree/files
router.get('/repos/:owner/:repo/tree', protect, getRepositoryFiles);

// Get repository file content
router.get('/repos/:owner/:repo/file', protect, getRepositoryFile);

// Review repository
router.post('/review', protect, reviewRepository);

// Disconnect GitHub
router.delete('/disconnect', protect, disconnectGitHub);

export default router;
