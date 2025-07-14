const express = require('express');
const router = express.Router();
const reservationRepo = require('../Repositories/reservationRepository');

// POST /reservations
// Create a new reservation and mark habitation reserved
router.post('/', async (req, res) => {
  const reservationData = req.body;
  const result = await reservationRepo.createReservation(reservationData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// PUT /reservations/:id
// Update reservation by ID
router.put('/:id', async (req, res) => {
  const reservationId = req.params.id;
  const updateData = req.body;
  const result = await reservationRepo.updateReservation(reservationId, updateData);
  if (result.success) return res.json(result);
  if (result.message === 'Reservation not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// DELETE /reservations/:id
// Delete reservation and mark habitation not reserved
router.delete('/:id', async (req, res) => {
  const reservationId = req.params.id;
  const result = await reservationRepo.deleteReservation(reservationId);
  if (result.success) return res.json(result);
  if (result.message === 'Reservation not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// GET /reservations/:id
// Get reservation by ID
router.get('/:id', async (req, res) => {
  const reservationId = req.params.id;
  const result = await reservationRepo.getReservationById(reservationId);
  if (result.success) return res.json(result);
  if (result.message === 'Reservation not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// GET /reservations/habitation/:habitationId
// Get all reservations by habitation ID
router.get('/habitation/:habitationId', async (req, res) => {
  const habitationId = req.params.habitationId;
  const result = await reservationRepo.getAllReservationsByHabitationId(habitationId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

// GET /reservations/habitation/:habitationId/new
// Get all new reservations (created today) by habitation ID
router.get('/habitation/:habitationId/new', async (req, res) => {
  const habitationId = req.params.habitationId;
  const result = await reservationRepo.getAllNewReservationsByHabitationId(habitationId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

// GET /reservations/user/:userId
// Get all reservations made by a user
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await reservationRepo.getAllReservationsByUserId(userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

module.exports = router;
