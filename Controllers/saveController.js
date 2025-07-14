const express = require('express');
const router = express.Router();
const saveRepo = require('../Repositories/saveRepository');

/**
 * POST /saves
 * Save a habitation by a user
 * Expects { habitationId, userId } in body
 */
router.post('/', async (req, res) => {
  const { habitationId, userId } = req.body;
  const result = await saveRepo.createSave(habitationId, userId);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

/**
 * DELETE /saves
 * Unsave a habitation by a user
 * Expects { habitationId, userId } in body
 */
router.delete('/', async (req, res) => {
  const { habitationId, userId } = req.body;
  const result = await saveRepo.deleteSave(habitationId, userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

/**
 * GET /saves/count/habitation/:habitationId
 * Get count of users who saved a habitation
 */
router.get('/count/habitation/:habitationId', async (req, res) => {
  const habitationId = req.params.habitationId;
  const result = await saveRepo.getSavedUserIdCountByHabitationId(habitationId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

/**
 * GET /saves/count/user/:userId
 * Get count of habitations saved by a user
 */
router.get('/count/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await saveRepo.getHabitationsCountBySavedUserId(userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

/**
 * GET /saves/user/:userId
 * Get all habitations saved by a user
 */
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await saveRepo.getHabitationsBySavedUserId(userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

module.exports = router;
