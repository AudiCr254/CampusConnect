const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const adminKey = require('../middleware/adminKey');

// Public routes
router.get('/topics', topicController.getAllTopics);
router.get('/topics/:id', topicController.getTopicById);

// Admin-protected routes
router.post('/topics', adminKey, topicController.createTopic);
router.put('/topics/:id', adminKey, topicController.updateTopic);
router.delete('/topics/:id', adminKey, topicController.deleteTopic);

module.exports = router;
