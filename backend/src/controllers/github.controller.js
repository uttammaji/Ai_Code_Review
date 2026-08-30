import GithubConnection from '../models/GithubConnection.js';

export const connectGitHub = async (req, res) => {
    try {
        console.log('🔵 CONNECT GITHUB CALLED');
        console.log('📦 Body:', req.body);
        console.log('📦 Body type:', typeof req.body);
        console.log('👤 User:', req.user?._id);

        // Check if body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('❌ Request body is empty');
            return res.status(400).json({
                success: false,
                message: 'Request body is empty. Please send data with Content-Type: application/json'
            });
        }

        const { githubId, username, email, avatar, name, accessToken } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!githubId) missingFields.push('githubId');
        if (!username) missingFields.push('username');
        if (!accessToken) missingFields.push('accessToken');

        if (missingFields.length > 0) {
            console.error('❌ Missing fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: ' + missingFields.join(', '),
                received: Object.keys(req.body)
            });
        }

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            console.error('❌ User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        console.log('✅ All validations passed');
        console.log('👤 GitHub Username:', username);
        console.log('👤 User ID:', req.user._id);

        // Save to database
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
        console.error('Get GitHub user error:', error);
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
        console.error('Get repos error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch repositories' });
    }
};

export const disconnectGitHub = async (req, res) => {
    try {
        await GithubConnection.deleteOne({ user: req.user._id });
        return res.status(200).json({ success: true, message: 'GitHub disconnected' });
    } catch (error) {
        console.error('Disconnect error:', error);
        return res.status(500).json({ success: false, message: 'Failed to disconnect' });
    }
};
