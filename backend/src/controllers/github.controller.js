// backend/src/controllers/github.controller.js
import jwt from 'jsonwebtoken';
import GithubConnection from '../models/GithubConnection.js';
import CodeReview from '../models/CodeReview.js';
import ReviewHistory from '../models/ReviewHistory.js';
import { reviewCode } from '../services/aiReview.service.js';
import {
    exchangeOAuthCode,
    getAuthenticatedUser,
    getRepositories,
    getRepositoryBranches,
    getRepositoryTree,
    getFileContent,
} from '../services/github.service.js';
import { buildReviewResponse } from '../utils/transformers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:5000/api/github/callback';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const CODE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.c', '.cpp', '.cs', '.rs', '.rb', '.php', '.swift', '.kt'];
const MAX_FILE_SIZE = 50000;
const MAX_FILES_PER_REVIEW = 10;
const CHUNK_SIZE = 5;

const LANGUAGE_MAP = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    py: 'python',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin'
};

const respondWithError = (res, status, message) => {
    return res.status(status).json({ success: false, message: message });
};

const respondWithSuccess = (res, data, status = 200) => {
    return res.status(status).json({ success: true, ...data });
};

const githubUserPayload = (connection) => ({
    connected: true,
    username: connection.username,
    avatar: connection.avatarUrl,
    connectedAt: connection.createdAt,
});

const redirectToClient = (res, status, errorMessage = '') => {
    const url = new URL('/github', CLIENT_URL);
    url.searchParams.set('connection', status);
    if (errorMessage) url.searchParams.set('error', errorMessage);
    return res.redirect(url.toString());
};

const getGitHubConnection = async (userId) => {
    const connection = await GithubConnection.findOne({ user: userId });
    if (!connection) {
        throw new Error('GitHub account not connected');
    }
    return connection;
};

const detectLanguage = (files) => {
    const extCount = {};
    for (const file of files) {
        const ext = '.' + (file.path.split('.').pop()?.toLowerCase() || 'txt');
        extCount[ext] = (extCount[ext] || 0) + 1;
    }
    const mostCommonExt = Object.entries(extCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '.js';
    return LANGUAGE_MAP[mostCommonExt.replace('.', '')] || 'javascript';
};

export const githubAuth = (req, res) => {
    try {
        if (!GITHUB_CLIENT_ID) {
            console.error('GITHUB_CLIENT_ID not configured');
            return res.status(500).json({
                success: false,
                message: 'GitHub OAuth is not configured'
            });
        }

        console.log('GitHub Auth - Redirect URI:', GITHUB_REDIRECT_URI);
        
        const githubAuthUrl = 
            'https://github.com/login/oauth/authorize?' +
            'client_id=' + GITHUB_CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(GITHUB_REDIRECT_URI) +
            '&scope=read:user,repo' +
            '&allow_signup=true';

        console.log('GitHub Auth URL:', githubAuthUrl);
        
        res.redirect(githubAuthUrl);
    } catch (error) {
        console.error('Error initiating GitHub auth:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate GitHub authentication'
        });
    }
};

export const githubOAuthCallback = async (req, res) => {
    const { code, error: githubError, error_description } = req.query;

    console.log('GitHub Callback received');
    console.log('Code:', code ? 'present' : 'missing');

    if (githubError) {
        console.error('GitHub OAuth error:', githubError, error_description);
        return redirectToClient(res, 'failed', error_description || 'Authorization denied');
    }

    if (!code) {
        return redirectToClient(res, 'failed', 'Missing authorization code');
    }

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: GITHUB_REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();
        console.log('Token Response:', tokenData);

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error('No access token received');
        }

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        const githubUser = await userResponse.json();
        console.log('GitHub User:', githubUser.login);

        const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        const emails = await emailResponse.json();
        const primaryEmail = emails.find(email => email.primary)?.email || emails[0]?.email;

        const redirectUrl = CLIENT_URL + '/github/callback?' +
            'githubId=' + githubUser.id +
            '&username=' + githubUser.login +
            '&email=' + (primaryEmail || '') +
            '&avatar=' + encodeURIComponent(githubUser.avatar_url) +
            '&name=' + encodeURIComponent(githubUser.name || githubUser.login) +
            '&token=' + encodeURIComponent(accessToken);

        console.log('Redirecting to frontend:', redirectUrl);

        res.redirect(redirectUrl);
    } catch (error) {
        console.error('GitHub OAuth error:', error.message);
        res.redirect(CLIENT_URL + '/github/error?message=Authentication failed');
    }
};

// backend/src/controllers/github.controller.js
export const connectGitHub = async (req, res) => {
    try {
        console.log('🔵 CONNECT GITHUB CALLED');
        console.log('📝 Headers:', req.headers);
        console.log('📦 Body:', req.body);
        console.log('👤 User:', req.user);

        // Check if body exists
        if (!req.body) {
            console.error('❌ Request body is undefined');
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }

        const { githubId, username, email, avatar, name, accessToken } = req.body;

        console.log('📊 Extracted data:', { githubId, username, hasToken: !!accessToken });

        // Validate each field
        if (!githubId) {
            console.error('❌ Missing githubId');
            return res.status(400).json({
                success: false,
                message: 'Missing githubId'
            });
        }
        if (!username) {
            console.error('❌ Missing username');
            return res.status(400).json({
                success: false,
                message: 'Missing username'
            });
        }
        if (!accessToken) {
            console.error('❌ Missing accessToken');
            return res.status(400).json({
                success: false,
                message: 'Missing accessToken'
            });
        }

        console.log('✅ Validation passed');
        console.log('👤 GitHub Username:', username);

        // Check if user exists
        if (!req.user || !req.user._id) {
            console.error('❌ User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Save to database
        let connection = await GithubConnection.findOne({ user: req.user._id });

        if (connection) {
            connection.githubId = String(githubId);
            connection.username = username;
            connection.email = email || connection.email || '';
            connection.avatarUrl = avatar || connection.avatarUrl || '';
            connection.accessToken = accessToken;
            await connection.save();
            console.log('✅ Connection updated');
        } else {
            connection = new GithubConnection({
                user: req.user._id,
                githubId: String(githubId),
                username: username,
                email: email || '',
                avatarUrl: avatar || '',
                accessToken: accessToken,
            });
            await connection.save();
            console.log('✅ New connection created');
        }

        return res.status(200).json({
            success: true,
            message: 'GitHub connected successfully',
            user: {
                username: connection.username,
                avatar: connection.avatarUrl,
                connected: true,
            }
        });
    } catch (error) {
        console.error('❌ Connect GitHub error:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to connect GitHub'
        });
    }
};

export const getGitHubUser = async (req, res) => {
    try {
        const connection = await GithubConnection.findOne({ user: req.user._id });
        
        if (!connection) {
            return respondWithSuccess(res, {
                connected: false,
                user: null
            });
        }

        return respondWithSuccess(res, {
            connected: true,
            user: githubUserPayload(connection)
        });
    } catch (error) {
        console.error('Failed to fetch GitHub status:', error);
        return respondWithError(res, 500, 'Failed to fetch GitHub connection status');
    }
};

export const getGithubRepos = async (req, res) => {
    try {
        const connection = await getGitHubConnection(req.user._id);
        
        const response = await fetch('https://api.github.com/user/repos', {
            headers: {
                Authorization: 'Bearer ' + connection.accessToken,
            },
        });

        const repositories = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                await GithubConnection.deleteOne({ user: req.user._id });
                return respondWithError(res, 401, 'GitHub token expired. Please reconnect.');
            }
            throw new Error('Failed to fetch repositories');
        }

        const formattedRepos = repositories.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description || '',
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            updated_at: repo.updated_at,
            default_branch: repo.default_branch,
            private: repo.private,
            html_url: repo.html_url,
        }));

        return respondWithSuccess(res, { repositories: formattedRepos });
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        return respondWithError(res, 502, 'Failed to fetch GitHub repositories');
    }
};

export const getBranches = async (req, res) => {
    try {
        const { owner, repo } = req.params;
        if (!owner || !repo) {
            return respondWithError(res, 400, 'Owner and repository name are required');
        }

        const connection = await getGitHubConnection(req.user._id);
        
        const response = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/branches', {
            headers: {
                Authorization: 'Bearer ' + connection.accessToken,
            },
        });

        const branches = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch branches');
        }

        return respondWithSuccess(res, { 
            branches: branches.map((branch) => ({
                name: branch.name,
                sha: branch.commit?.sha,
                protected: branch.protected || false
            }))
        });
    } catch (error) {
        console.error('Failed to fetch branches:', error);
        return respondWithError(res, 502, 'Failed to load repository branches');
    }
};

export const getRepositoryFiles = async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { branch = 'main' } = req.query;

        if (!owner || !repo) {
            return respondWithError(res, 400, 'Owner and repository name are required');
        }

        const connection = await getGitHubConnection(req.user._id);
        
        const response = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/git/trees/' + branch + '?recursive=1', {
            headers: {
                Authorization: 'Bearer ' + connection.accessToken,
            },
        });

        const treeData = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch repository tree');
        }

        const files = (treeData.tree || [])
            .filter((item) => item.type === 'blob')
            .slice(0, 1000)
            .map((item) => ({ 
                path: item.path, 
                size: item.size || 0,
                url: item.url 
            }));

        return respondWithSuccess(res, { 
            files: files, 
            truncated: files.length === 1000 
        });
    } catch (error) {
        console.error('Failed to fetch repository files:', error);
        return respondWithError(res, 502, 'Failed to load repository file tree');
    }
};

export const getRepositoryFile = async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { path, branch = 'main' } = req.query;

        if (!path || typeof path !== 'string') {
            return respondWithError(res, 400, 'A valid file path is required');
        }

        if (!owner || !repo) {
            return respondWithError(res, 400, 'Owner and repository name are required');
        }

        const connection = await getGitHubConnection(req.user._id);
        
        const response = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + path + '?ref=' + branch, {
            headers: {
                Authorization: 'Bearer ' + connection.accessToken,
            },
        });

        const file = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }

        if (!file.content) {
            return respondWithError(res, 404, 'File content not available');
        }

        if (file.size > MAX_FILE_SIZE) {
            return respondWithError(res, 413, 'File size exceeds ' + (MAX_FILE_SIZE / 1000) + 'KB limit for AI review');
        }

        const content = Buffer.from(file.content, 'base64').toString('utf8');
        
        return respondWithSuccess(res, {
            path: file.path,
            content: content,
            size: file.size,
            encoding: file.encoding
        });
    } catch (error) {
        console.error('Failed to fetch file content:', error);
        return respondWithError(res, 502, 'Failed to load file content');
    }
};

export const disconnectGitHub = async (req, res) => {
    try {
        const result = await GithubConnection.deleteOne({ user: req.user._id });
        
        if (result.deletedCount === 0) {
            return respondWithSuccess(res, { message: 'No GitHub account was connected' });
        }

        return respondWithSuccess(res, { message: 'GitHub account disconnected successfully' });
    } catch (error) {
        console.error('Failed to disconnect GitHub:', error);
        return respondWithError(res, 500, 'Failed to disconnect GitHub account');
    }
};

export const reviewRepository = async (req, res) => {
    try {
        const { owner, repo, branch, files: selectedFiles } = req.body;

        if (!owner || !repo) {
            return respondWithError(res, 400, 'Owner and repository name are required');
        }

        const connection = await getGitHubConnection(req.user._id);
        const accessToken = connection.accessToken;

        const treeResp = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/git/trees/' + (branch || 'main') + '?recursive=1', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        const treeData = await treeResp.json();
        const tree = treeData.tree || [];

        let codeFiles = tree.filter((item) => 
            item.type === 'blob' && 
            CODE_EXTENSIONS.some((ext) => item.path.endsWith(ext)) &&
            (!item.size || item.size <= MAX_FILE_SIZE)
        );

        if (selectedFiles && Array.isArray(selectedFiles) && selectedFiles.length > 0) {
            codeFiles = codeFiles.filter((file) => selectedFiles.includes(file.path));
        }

        if (codeFiles.length === 0) {
            return respondWithError(res, 404, 'No reviewable code files found in the repository');
        }

        const filesToReview = codeFiles.slice(0, MAX_FILES_PER_REVIEW);

        const fileContents = [];
        for (const file of filesToReview) {
            try {
                const fileResp = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + file.path + '?ref=' + (branch || 'main'), {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                });

                const fileData = await fileResp.json();
                if (fileData.content) {
                    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
                    fileContents.push({ path: file.path, content: content });
                }
            } catch (err) {
                console.warn('Failed to fetch file:', file.path, err.message);
            }
        }

        if (fileContents.length === 0) {
            return respondWithError(res, 502, 'Failed to fetch any repository files');
        }

        const language = detectLanguage(fileContents);

        const chunks = [];
        for (let i = 0; i < fileContents.length; i += CHUNK_SIZE) {
            chunks.push(fileContents.slice(i, i + CHUNK_SIZE));
        }

        const aggregated = {
            scoreSum: 0,
            scoreCount: 0,
            categoriesSum: {},
            categoriesCount: 0,
            summaryParts: [],
            bugs: [],
            securityIssues: [],
            performanceIssues: [],
            suggestions: [],
            improvedCodeParts: [],
        };

        for (const chunk of chunks) {
            const chunkCombined = chunk.map((f) => '// FILE: ' + f.path + '\n' + f.content).join('\n\n');
            try {
                const chunkResult = await reviewCode(chunkCombined, language);
                
                if (typeof chunkResult.score === 'number') {
                    aggregated.scoreSum += chunkResult.score;
                    aggregated.scoreCount++;
                }

                if (chunkResult.categories) {
                    aggregated.categoriesCount++;
                    for (const [key, value] of Object.entries(chunkResult.categories)) {
                        if (typeof value === 'number') {
                            aggregated.categoriesSum[key] = (aggregated.categoriesSum[key] || 0) + value;
                        }
                    }
                }

                if (chunkResult.summary) aggregated.summaryParts.push(chunkResult.summary);
                if (Array.isArray(chunkResult.bugs)) {
                    aggregated.bugs.push(...chunkResult.bugs.map((b) => ({ ...b, file: b.file || chunk[0]?.path })));
                }
                if (Array.isArray(chunkResult.securityIssues)) {
                    aggregated.securityIssues.push(...chunkResult.securityIssues.map((s) => ({ ...s, file: s.file || chunk[0]?.path })));
                }
                if (Array.isArray(chunkResult.performanceIssues)) {
                    aggregated.performanceIssues.push(...chunkResult.performanceIssues.map((p) => ({ ...p, file: p.file || chunk[0]?.path })));
                }
                if (Array.isArray(chunkResult.suggestions)) {
                    aggregated.suggestions.push(...chunkResult.suggestions);
                }
                if (chunkResult.improvedCode) {
                    aggregated.improvedCodeParts.push(chunkResult.improvedCode);
                }
            } catch (err) {
                console.warn('AI chunk review failed:', err.message);
            }
        }

        const finalScore = aggregated.scoreCount > 0 
            ? Math.round(aggregated.scoreSum / aggregated.scoreCount) 
            : 0;

        const finalCategories = {};
        if (aggregated.categoriesCount > 0) {
            for (const [key, value] of Object.entries(aggregated.categoriesSum)) {
                finalCategories[key] = Math.round(value / aggregated.categoriesCount);
            }
        }

        const finalImprovedCode = aggregated.improvedCodeParts.join('\n\n// ---- CHUNK BREAK ----\n\n');

        const reviewDoc = await CodeReview.create({
            user: req.user._id,
            project: null,
            language: language,
            code: fileContents.slice(0, 20).map((f) => '// FILE: ' + f.path + '\n' + f.content).join('\n\n'),
            score: finalScore,
            categories: {
                security: finalCategories.security || 0,
                performance: finalCategories.performance || 0,
                quality: finalCategories.quality || 0,
                maintainability: finalCategories.maintainability || 0,
                readability: finalCategories.readability || 85,
                bestPractices: finalCategories.bestPractices || 80,
            },
            summary: aggregated.summaryParts.join('\n\n'),
            bugs: aggregated.bugs,
            securityIssues: aggregated.securityIssues,
            performanceIssues: aggregated.performanceIssues,
            suggestions: aggregated.suggestions,
            improvedCode: finalImprovedCode || '',
        });

        try {
            await ReviewHistory.create({
                user: req.user._id,
                review: reviewDoc._id,
                project: null,
                language: reviewDoc.language,
                score: reviewDoc.score,
                status: 'completed'
            });
        } catch (err) {
            console.warn('Failed to create history entry:', err.message);
        }

        const payload = buildReviewResponse(reviewDoc.toObject(), null);

        return respondWithSuccess(res, {
            message: 'Repository reviewed successfully',
            review: payload
        }, 201);
    } catch (error) {
        console.error('Repository review failed:', error);
        return respondWithError(res, 500, 'Failed to review repository');
    }
};
