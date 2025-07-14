const express = require('express');
const router = express.Router();
const paymentRepo = require('../Repositories/paymentRepository'); // Adjust path as needed

// POST /payments
router.post('/', async (req, res) => {
  const paymentData = req.body;
  const result = await paymentRepo.createPayment(paymentData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// GET /payments/owner/:ownerId
router.get('/owner/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;
  const result = await paymentRepo.getPaymentsByHabitationOwnerId(ownerId);
  if (result.success) return res.json(result);
  return res.status(500).json(result);
});

// GET /payments/reservation/:reservationId
router.get('/reservation/:reservationId', async (req, res) => {
  const reservationId = req.params.reservationId;
  const result = await paymentRepo.getPaymentByReservationId(reservationId);
  if (result.success) return res.json(result);
  return res.status(404).json(result);
});

module.exports = router;
