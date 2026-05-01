const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/discover', authenticateToken, automationController.discoverCameras);
router.post('/patrol/:id', authenticateToken, automationController.togglePatrol);

module.exports = router;
