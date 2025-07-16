import express from 'express';
import worldAnvilAPI from '../services/worldAnvilAPI.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userToken || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Set credentials for this request
  worldAnvilAPI.setCredentials(req.session.userToken, req.session.appKey);
  next();
};

// GET /api/characters/:characterId/raw
router.get('/:characterId/raw', requireAuth, async (req, res) => {
  try {
    const { characterId } = req.params;

    const article = await worldAnvilAPI.fetchCharacter(characterId);
    res.json(article);

  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Processing will be handled by the frontend

// GET /api/characters/secrets/:secretId
router.get('/secrets/:secretId', requireAuth, async (req, res) => {
  try {
    const { secretId } = req.params;

    const secretContent = await worldAnvilAPI.fetchSecrets(secretId);
    res.json({ content: secretContent });

  } catch (error) {
    console.error('Get secret error:', error);
    res.status(500).json({ error: 'Failed to fetch secret' });
  }
});

export default router;