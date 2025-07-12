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

// GET /api/worlds/:userId
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const worlds = await worldAnvilAPI.getWorlds(userId);
    res.json(worlds);

  } catch (error) {
    console.error('Get worlds error:', error);
    res.status(500).json({ error: 'Failed to fetch worlds' });
  }
});

// GET /api/worlds/:worldId/characters
router.get('/:worldId/characters', requireAuth, async (req, res) => {
  try {
    const { worldId } = req.params;

    const characters = await worldAnvilAPI.getCharacterSheets(worldId);
    res.json(characters);

  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

export default router;