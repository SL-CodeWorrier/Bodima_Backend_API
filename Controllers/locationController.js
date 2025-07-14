const express = require('express');
const router = express.Router();
const locationRepo = require('../Repositories/locationRepository'); // adjust path

// GET /locations/habitation/:habitationId
router.get('/habitation/:habitationId', async (req, res) => {
  const result = await locationRepo.getLocationByHabitationId(req.params.habitationId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

// GET /locations/district/:district
router.get('/district/:district', async (req, res) => {
  const result = await locationRepo.getHabitationsByDistrict(req.params.district);
  if (result.success) return res.json(result);
  return res.status(500).json(result);
});

// POST /locations
router.post('/', async (req, res) => {
  const result = await locationRepo.createLocation(req.body);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// PUT /locations/habitation/:habitationId
router.put('/habitation/:habitationId', async (req, res) => {
  const result = await locationRepo.updateLocation(req.params.habitationId, req.body);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

// DELETE /locations/habitation/:habitationId
router.delete('/habitation/:habitationId', async (req, res) => {
  const result = await locationRepo.deleteLocation(req.params.habitationId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

// GET /locations/nearest?latitude=...&longitude=...
router.get('/nearest', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'latitude and longitude query parameters are required' });
  }
  const result = await locationRepo.getHabitationByNearestCoordinates(latitude, longitude);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

module.exports = router;
