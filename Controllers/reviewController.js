const express = require('express');
const router = express.Router();
const reviewRepo = require('../Repositories/reviewRepository');

// POST /reviews
// Create a new review
router.post('/', async (req, res) => {
  const reviewData = req.body;
  const result = await reviewRepo.createReview(reviewData);
  if (result.success) return res.status(201).json(result);
  return res.status(400).json(result);
});

// PUT /reviews/:id
// Update a review by ID
router.put('/:id', async (req, res) => {
  const reviewId = req.params.id;
  const updateData = req.body;
  const result = await reviewRepo.updateReview(reviewId, updateData);
  if (result.success) return res.json(result);
  if (result.message === 'Review not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// DELETE /reviews/:id
// Delete a review by ID
router.delete('/:id', async (req, res) => {
  const reviewId = req.params.id;
  const result = await reviewRepo.deleteReview(reviewId);
  if (result.success) return res.json(result);
  if (result.message === 'Review not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

// GET /reviews/user/:userId
// Get all reviews by user ID with total reviewCount
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await reviewRepo.getReviewWithTotalReviewCountByUserId(userId);
  if (result.success) return res.json(result);
  return res.status(400).json(result);
});

// GET /reviews/reservation/:reservationId
// Get all reviews by reservation ID (via habitation) with total reviewCount
router.get('/reservation/:reservationId', async (req, res) => {
  const reservationId = req.params.reservationId;
  const result = await reviewRepo.getReviewWithTotalReviewCountByReservationId(reservationId);
  if (result.success) return res.json(result);
  if (result.message === 'Reservation not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

router.get('/habitation/:habitationId', async (req, res) => {
  const habitationId = req.params.habitationId;
  const result = await reviewRepo.getAllReviewsWithTotalCountByHabitationId(habitationId);
  if (result.success) return res.json(result);
  if (result.message === 'Reservation not found') return res.status(404).json(result);
  return res.status(400).json(result);
});

module.exports = router;
