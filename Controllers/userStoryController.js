const express = require('express');
const router = express.Router();
const storyRepo = require('../Repositories/userStoryRepository');

/**
 * GET /stories
 * Get all stories with user info populated
 */
router.get('/', async (req, res) => {
  const result = await storyRepo.getAllStories();
  if (result.success) return res.json(result);
  return res.status(500).json(result);
});

/**
 * GET /stories/:id
 * Get a single story by ID with user info populated
 */
router.get('/:id', async (req, res) => {
  const storyId = req.params.id;
  const result = await storyRepo.getUserStoryById(storyId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

/**
 * POST /stories
 * Create a new story
 */
router.post('/', async (req, res) => {
  const storyData = req.body;
  const result = await storyRepo.createStory(storyData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

/**
 * PUT /stories/:id
 * Update an existing story by ID
 */
router.put('/:id', async (req, res) => {
  const storyId = req.params.id;
  const updateData = req.body;
  const result = await storyRepo.updateStory(storyId, updateData);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

/**
 * DELETE /stories/:id
 * Delete a story by ID
 */
router.delete('/:id', async (req, res) => {
  const storyId = req.params.id;
  const result = await storyRepo.deleteStory(storyId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

module.exports = router;
