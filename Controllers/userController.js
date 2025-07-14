const express = require('express');
const router = express.Router();
const userRepo = require('../Repositories/userRepository');

/**
 * GET /users/:authId
 * Get current user profile by authId
 */
router.get('/:authId', async (req, res) => {
  const authId = req.params.authId;
  const result = await userRepo.getCurrentUser(authId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

/**
 * POST /users/:authId
 * Create user profile linked to authId
 * Expects user data in body
 */
router.post('/:authId', async (req, res) => {
  const authId = req.params.authId;
  const userData = req.body;
  const result = await userRepo.createUser(authId, userData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

/**
 * PUT /users/:authId
 * Update user profile by authId
 * Expects update data in body
 */
router.put('/:authId', async (req, res) => {
  const authId = req.params.authId;
  const updateData = req.body;
  const result = await userRepo.updateUser(authId, updateData);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

/**
 * DELETE /users/:authId
 * Delete user profile by authId
 */
router.delete('/:authId', async (req, res) => {
  const authId = req.params.authId;
  const result = await userRepo.deleteUser(authId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

module.exports = router;
