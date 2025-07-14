const express = require('express');
const router = express.Router();
const notificationRepo = require('../Repositories/notificationRepository');

// POST /notifications
router.post('/', async (req, res) => {
  const notificationData = req.body;
  const result = await notificationRepo.createNotification(notificationData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// PUT /notifications/:id
router.put('/:id', async (req, res) => {
  const notificationId = req.params.id;
  const updateData = req.body;
  const result = await notificationRepo.updateNotification(notificationId, updateData);
  if (result.success) return res.json(result);
  if (result.message === 'Notification not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// GET /notifications/user/:userId
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching notifications for user:', userId);
  const result = await notificationRepo.getAllNotificationsByUserId(userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

// GET /notifications
router.get('/', async (req, res) => {
  const result = await notificationRepo.getAllNotifications();
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

module.exports = router;