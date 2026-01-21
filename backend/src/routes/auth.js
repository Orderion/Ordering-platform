import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const router = express.Router();

// Configure GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({
      where: { githubId: profile.id.toString() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: profile.id.toString(),
          name: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
          avatarUrl: profile.photos?.[0]?.value
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value || user.email,
          avatarUrl: profile.photos?.[0]?.value || user.avatarUrl
        }
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/failure' }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, githubId: user.githubId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?success=true`);
    } catch (error) {
      console.error('Auth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?success=false&error=${encodeURIComponent(error.message)}`);
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, githubId: true, name: true, email: true, avatarUrl: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
  res.json({ message: 'Logged out successfully' });
});

// Auth failure
router.get('/failure', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/auth/callback?success=false`);
});

export default router;
