// backend/src/routes/github.routes.js
import express from 'express';

import {
    githubAuth,  
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

// ============ OAUTH ROUTES ============

// ✅ Initiate GitHub OAuth - Redirect to GitHub
router.get('/auth', githubAuth);

// GitHub OAuth callback
router.get('/callback', githubOAuthCallback);

// ============ PROTECTED ROUTES ============

// Connect GitHub account (save to database)
router.post('/connect', protect, connectGitHub);

// Get GitHub user data
router.get('/user', protect, getGitHubUser);

// Get all repositories
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
