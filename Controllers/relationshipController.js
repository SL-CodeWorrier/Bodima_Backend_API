const express = require('express');
const router = express.Router();
const relationshipRepo = require('../Repositories/relationshipRepository');

// POST /relationships/follow
router.post('/follow', async (req, res) => {
  const { followerId, followingId } = req.body;
  const result = await relationshipRepo.createRelationship(followerId, followingId);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// DELETE /relationships/unfollow
router.delete('/unfollow', async (req, res) => {
  // Assuming followerId and followingId are sent in request body or query
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    return res.status(400).json({ success: false, message: "Missing followerId or followingId" });
  }
  const result = await relationshipRepo.deleteRelationship(followerId, followingId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

// GET /relationships/following/:userId
router.get('/following/:userId', async (req, res) => {
  const currentUserId = req.params.userId;
  const result = await relationshipRepo.getFollowingUsersWithCountByCurrentUserId(currentUserId);
  if (result.success) return res.json(result);
  return res.status(500).json(result);
});

// GET /relationships/followers/:userId
router.get('/followers/:userId', async (req, res) => {
  const currentUserId = req.params.userId;
  const result = await relationshipRepo.getFollowersWithCountByCurrentUserId(currentUserId);
  if (result.success) return res.json(result);
  return res.status(500).json(result);
});

module.exports = router;
