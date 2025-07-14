const Review = require('../Models/review');
const Reservation = require('../Models/reservation');
const Habitation = require('../Models/habitation');

/**
 * Create a review
 */
const createReview = async (reviewData) => {
  console.log('createReview called with:', reviewData);
  try {
    const newReview = new Review(reviewData);
    console.log('Created Review instance:', newReview);

    await newReview.save();
    console.log('Review saved:', newReview);

    return { success: true, message: 'Review created successfully', data: newReview };
  } catch (error) {
    console.error('Failed to create review:', error);
    return { success: false, message: 'Failed to create review', error: error.message };
  }
};

/**
 * Update a review by ID
 */
const updateReview = async (reviewId, updateData) => {
  console.log('updateReview called with reviewId:', reviewId, 'updateData:', updateData);
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      console.log('Review not found for update:', reviewId);
      return { success: false, message: 'Review not found' };
    }

    console.log('Review updated:', updatedReview);
    return { success: true, message: 'Review updated successfully', data: updatedReview };
  } catch (error) {
    console.error('Failed to update review:', error);
    return { success: false, message: 'Failed to update review', error: error.message };
  }
};

/**
 * Delete a review by ID
 */
const deleteReview = async (reviewId) => {
  console.log('deleteReview called with reviewId:', reviewId);
  try {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      console.log('Review not found for deletion:', reviewId);
      return { success: false, message: 'Review not found' };
    }
    console.log('Review deleted:', deleted);
    return { success: true, message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { success: false, message: 'Failed to delete review', error: error.message };
  }
};

/**
 * Get all reviews by User ID with total reviewCount
 */
const getReviewWithTotalReviewCountByUserId = async (userId) => {
  console.log('getReviewWithTotalReviewCountByUserId called with userId:', userId);
  try {
    const reviews = await Review.find({ user: userId }).populate('habitation', 'name');
    console.log(`Found ${reviews.length} reviews for userId:`, userId);

    const total = reviews.reduce((acc, r) => acc + r.reviewCount, 0);
    console.log('Total reviewCount:', total);

    return { success: true, totalReviewCount: total, data: reviews };
  } catch (error) {
    console.error('Failed to get reviews:', error);
    return { success: false, message: 'Failed to get reviews', error: error.message };
  }
};

/**
 * Get all reviews by Reservation ID (via habitation) with total reviewCount
 */
const getReviewWithTotalReviewCountByReservationId = async (reservationId) => {
  console.log('getReviewWithTotalReviewCountByReservationId called with reservationId:', reservationId);
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      console.log('Reservation not found:', reservationId);
      return { success: false, message: 'Reservation not found' };
    }
    console.log('Reservation found:', reservation);

    const habitationId = reservation.habitation;
    console.log('Looking up reviews for habitationId:', habitationId);

    const reviews = await Review.find({ habitation: habitationId }).populate('user', 'firstName lastName');
    console.log(`Found ${reviews.length} reviews for habitationId:`, habitationId);

    const total = reviews.reduce((acc, r) => acc + r.reviewCount, 0);
    console.log('Total reviewCount:', total);

    return { success: true, totalReviewCount: total, data: reviews };
  } catch (error) {
    console.error('Failed to get reviews by reservation:', error);
    return { success: false, message: 'Failed to get reviews by reservation', error: error.message };
  }
};

/**
 * Get all reviews by Habitation ID with total reviewCount
 */
const getAllReviewsWithTotalCountByHabitationId = async (habitationId) => {
  console.log('getAllReviewsWithTotalCountByHabitationId called with habitationId:', habitationId);
  try {
    const reviews = await Review.find({ habitation: habitationId }).populate('user', 'firstName lastName');
    console.log(`Found ${reviews.length} reviews for habitationId:`, habitationId);

    const total = reviews.reduce((acc, review) => acc + review.reviewCount, 0);
    console.log('Total reviewCount:', total);

    return {
      success: true,
      totalReviewCount: total,
      data: reviews
    };
  } catch (error) {
    console.error('Failed to get reviews by habitationId:', error);
    return {
      success: false,
      message: 'Failed to get reviews by habitationId',
      error: error.message
    };
  }
};


module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewWithTotalReviewCountByUserId,
  getReviewWithTotalReviewCountByReservationId,
  getAllReviewsWithTotalCountByHabitationId
};
