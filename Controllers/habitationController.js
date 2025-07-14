const express = require('express');
const router = express.Router();

const habitationService = require('../Repositories/habitationRepository'); 
// Adjust path if necessary

// Get all habitations
router.get('/', async (req, res) => {
  const result = await habitationService.getAllHabitations();
  res.status(result.success ? 200 : 500).json(result);
});

// Get all habitations created this month
router.get('/this-month', async (req, res) => {
  const result = await habitationService.getAllHabitationsThisMonth();
  res.status(result.success ? 200 : 500).json(result);
});

// Get habitation by ID
router.get('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;
  const result = await habitationService.getHabitationById(habitationId);
  res.status(result.success ? 200 : 404).json(result);
});

// Get all habitations by user ID
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await habitationService.getHabitationsByUserId(userId);
  res.status(result.success ? 200 : 500).json(result);
});

// Create new habitation
router.post('/', async (req, res) => {
  const habitationData = req.body;
  const result = await habitationService.createHabitation(habitationData);
  res.status(result.success ? 201 : 400).json(result);
});

// Update habitation by ID
router.put('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;
  const updateData = req.body;
  const result = await habitationService.updateHabitation(habitationId, updateData);
  res.status(result.success ? 200 : 404).json(result);
});

// Delete habitation by ID
router.delete('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;
  const result = await habitationService.deleteHabitation(habitationId);
  res.status(result.success ? 200 : 404).json(result);
});

// Add picture to habitation
router.post('/:habitationId/pictures', async (req, res) => {
  const { habitationId } = req.params;
  const { pictureUrl } = req.body;
  if (!pictureUrl) {
    return res.status(400).json({ success: false, message: 'pictureUrl is required' });
  }
  const result = await habitationService.addHabitationPicture(habitationId, pictureUrl);
  res.status(result.success ? 201 : 400).json(result);
});

// Remove habitation picture by picture ID
router.delete('/pictures/:pictureId', async (req, res) => {
  const { pictureId } = req.params;
  const result = await habitationService.removeHabitationPicture(pictureId);
  res.status(result.success ? 200 : 404).json(result);
});

module.exports = router;
