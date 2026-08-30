import GithubConnection from '../models/GithubConnection.js';

console.log('✅ Loading GitHub controller...');

export const githubAuth = (req, res) => {
    try {
        const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
        const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'https://ai-code-review-1-09kf.onrender.com/api/github/callback';
        
        if (!GITHUB_CLIENT_ID) {
            console.error('❌ GITHUB_CLIENT_ID not configured');
            return res.status(500).json({
                success: false,
                message: 'GitHub OAuth is not configured'
            });
        }

        const githubAuthUrl = 
            'https://github.com/login/oauth/authorize?' +
            'client_id=' + GITHUB_CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(GITHUB_REDIRECT_URI) +
            '&scope=read:user,repo' +
            '&allow_signup=true';

        console.log('🔗 GitHub Auth URL:', githubAuthUrl);
        res.redirect(githubAuthUrl);
    } catch (error) {
        console.error('GitHub auth error:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate GitHub auth' });
    }
};

export const githubOAuthCallback = async (req, res) => {
    const { code } = req.query;
    const CLIENT_URL = process.env.CLIENT_URL || 'https://ai-code-review-u.vercel.app';
    
    console.log('🔄 GitHub Callback received, code:', code ? 'present' : 'missing');

    if (!code) {
        return res.redirect(CLIENT_URL + '/github/error?message=No code provided');
    }

    try {
        const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
        const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
        const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'https://ai-code-review-1-09kf.onrender.com/api/github/callback';

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: GITHUB_REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();
        console.log('🔑 Token Response:', tokenData);

        const accessToken = tokenData.access_token;
        if (!accessToken) {
            throw new Error('No access token received');
        }

        // Get GitHub user
        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: 'Bearer ' + accessToken },
        });
        const githubUser = await userRes.json();

        // Get email
        const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: 'Bearer ' + accessToken },
        });
        const emails = await emailRes.json();
        const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email || '';

        const redirectUrl = 
            CLIENT_URL + '/github/callback?' +
            'githubId=' + githubUser.id +
            '&username=' + githubUser.login +
            '&email=' + encodeURIComponent(primaryEmail) +
            '&avatar=' + encodeURIComponent(githubUser.avatar_url) +
            '&name=' + encodeURIComponent(githubUser.name || githubUser.login) +
            '&token=' + encodeURIComponent(accessToken);

        console.log('🔄 Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('❌ GitHub OAuth error:', error.message);
        res.redirect(CLIENT_URL + '/github/error?message=Authentication failed');
    }
};

export const connectGitHub = async (req, res) => {
    try {
        console.log('🔵 CONNECT GITHUB CALLED');
        console.log('📦 Body:', req.body);
        console.log('👤 User:', req.user?._id);

        const { githubId, username, email, avatar, name, accessToken } = req.body;

        if (!githubId || !username || !accessToken) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        let connection = await GithubConnection.findOne({ user: req.user._id });

        if (connection) {
            connection.githubId = String(githubId);
            connection.username = username;
            connection.email = email || '';
            connection.avatarUrl = avatar || '';
            connection.accessToken = accessToken;
            await connection.save();
            console.log('✅ Updated existing connection');
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
            console.log('✅ Created new connection');
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
        console.error('❌ Connect error:', error.message);
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
            return res.status(200).json({ connected: false, user: null });
        }
        return res.status(200).json({
            connected: true,
            user: {
                username: connection.username,
                avatar: connection.avatarUrl,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch GitHub status' });
    }
};

export const getGithubRepos = async (req, res) => {
    try {
        const connection = await GithubConnection.findOne({ user: req.user._id });
        if (!connection) {
            return res.status(401).json({ success: false, message: 'GitHub not connected' });
        }

        const response = await fetch('https://api.github.com/user/repos', {
            headers: { Authorization: 'Bearer ' + connection.accessToken },
        });

        const repos = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                await GithubConnection.deleteOne({ user: req.user._id });
                return res.status(401).json({ success: false, message: 'GitHub token expired' });
            }
            throw new Error('Failed to fetch repositories');
        }

        return res.status(200).json({
            success: true,
            repositories: repos.map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description || '',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                private: repo.private,
                default_branch: repo.default_branch,
            }))
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch repositories' });
    }
};

export const disconnectGitHub = async (req, res) => {
    try {
        await GithubConnection.deleteOne({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'GitHub disconnected' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to disconnect' });
    }
};
