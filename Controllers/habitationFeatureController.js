const express = require('express');
const router = express.Router();

const habitationFeatureService = require('../Repositories/habitationFeatureRepository'); // Adjust path as needed

// ✅ Create habitation feature
router.post('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;
  const featureData = req.body;

  const result = await habitationFeatureService.createHabitationFeature(habitationId, featureData);
  res.status(result.success ? 201 : 400).json(result);
});

// ✅ Get feature by habitation ID
router.get('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;

  const result = await habitationFeatureService.getFeatureByHabitationId(habitationId);
  res.status(result.success ? 200 : 404).json(result);
});

// ✅ Update feature by habitation ID
router.put('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;
  const updateData = req.body;

  const result = await habitationFeatureService.updateFeatureByHabitationId(habitationId, updateData);
  res.status(result.success ? 200 : 404).json(result);
});

// ✅ Delete feature by habitation ID
router.delete('/:habitationId', async (req, res) => {
  const { habitationId } = req.params;

  const result = await habitationFeatureService.deleteFeatureByHabitationId(habitationId);
  res.status(result.success ? 200 : 404).json(result);
});

module.exports = router;