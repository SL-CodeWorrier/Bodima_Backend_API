const express = require('express');
const router = express.Router();
const authService = require('../Repositories/authRepository'); // adjust path as needed

// POST /auth/register
router.post('/register', async (req, res) => {
  const userData = req.body;
  const result = await authService.registerUser(userData);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const credentials = req.body;
  const result = await authService.loginUser(credentials);
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
});

// GET /auth/user/:id  - get current user by ID
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const result = await authService.getCurrentUser(userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
});

// PUT /auth/user/:id - update user (with or without password)
router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  let result;

  // If password field exists in updateData, call updateUserWithPassword
  if ('password' in updateData) {
    result = await authService.updateUserWithPassword(userId, updateData);
  } else {
    // Otherwise update without password
    result = await authService.updateUserWithoutPassword(userId, updateData);
  }

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// DELETE /auth/user/:id - delete user by ID
router.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const result = await authService.deleteUser(userId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
});

module.exports = router;
