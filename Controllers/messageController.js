const express = require('express');
const router = express.Router();
const messageRepo = require('../Repositories/messageRepository');

// POST /messages
// Create a new message
router.post('/', async (req, res) => {
  const messageData = req.body;
  const result = await messageRepo.createMessage(messageData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// DELETE /messages/:id
// Delete a message by ID
router.delete('/:id', async (req, res) => {
  const messageId = req.params.id;
  const result = await messageRepo.deleteMessageById(messageId);
  if (result.success) return res.json(result);
  if (result.message === 'Message not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// GET /messages/receiver/:receiverId
// Get all messages for a specific receiver
router.get('/receiver/:receiverId', async (req, res) => {
  const receiverId = req.params.receiverId;
  const result = await messageRepo.getAllMessagesByReceiverId(receiverId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

module.exports = router;