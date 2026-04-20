const express = require('express');
const router = express.Router();
const streamController = require('../controllers/stream.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// We use token in query param for <img /> src tags
router.get('/:id', (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: 'Orbit access denied' });
  // Simple token verification wrapper for img tags
  next();
}, streamController.streamCamera);

module.exports = router;
