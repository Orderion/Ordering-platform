import { authenticateToken } from './auth.js';

export const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate
    authenticateToken(req, res, () => {
      // Check if user is admin
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;
      
      if (!adminGitHubId) {
        return res.status(500).json({ error: 'Admin configuration missing' });
      }

      if (req.user.githubId !== adminGitHubId) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      next();
    });
  } catch (error) {
    return res.status(403).json({ error: 'Admin access required' });
  }
};
