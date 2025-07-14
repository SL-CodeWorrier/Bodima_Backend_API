const Reservation = require('../Models/reservation');
const Habitation = require('../Models/habitation');

/**
 * Create a reservation and mark the habitation as reserved
 */
const createReservation = async (reservationData) => {
  console.log('createReservation called with:', reservationData);
  try {
    const newReservation = new Reservation(reservationData);
    console.log('Created new Reservation instance:', newReservation);

    await newReservation.save();
    console.log('Reservation saved:', newReservation);

    await Habitation.findByIdAndUpdate(reservationData.habitation, { isReserved: true });
    console.log(`Habitation ${reservationData.habitation} marked as reserved`);

    return { success: true, message: 'Reservation created', data: newReservation };
  } catch (error) {
    console.error('Failed to create reservation:', error);
    return { success: false, message: 'Failed to create reservation', error: error.message };
  }
};

/**
 * Update reservation by ID
 */
const updateReservation = async (reservationId, updateData) => {
  console.log('updateReservation called with reservationId:', reservationId, 'updateData:', updateData);
  try {
    const updated = await Reservation.findByIdAndUpdate(reservationId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      console.log('Reservation not found for update');
      return { success: false, message: 'Reservation not found' };
    }

    console.log('Reservation updated:', updated);
    return { success: true, message: 'Reservation updated', data: updated };
  } catch (error) {
    console.error('Failed to update reservation:', error);
    return { success: false, message: 'Failed to update reservation', error: error.message };
  }
};

/**
 * Delete reservation and update habitation isReserved to false
 */
const deleteReservation = async (reservationId) => {
  console.log('deleteReservation called with reservationId:', reservationId);
  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);

    if (!reservation) {
      console.log('Reservation not found for deletion');
      return { success: false, message: 'Reservation not found' };
    }
    console.log('Reservation deleted:', reservation);

    await Habitation.findByIdAndUpdate(reservation.habitation, { isReserved: false });
    console.log(`Habitation ${reservation.habitation} marked as not reserved`);

    return { success: true, message: 'Reservation deleted' };
  } catch (error) {
    console.error('Failed to delete reservation:', error);
    return { success: false, message: 'Failed to delete reservation', error: error.message };
  }
};

/**
 * Get reservation by ID
 */
const getReservationById = async (reservationId) => {
  console.log('getReservationById called with reservationId:', reservationId);
  try {
    const reservation = await Reservation.findById(reservationId)
      .populate('user', '-__v')
      .populate('habitation', '-__v');

    if (!reservation) {
      console.log('Reservation not found');
      return { success: false, message: 'Reservation not found' };
    }

    console.log('Reservation found:', reservation);
    return { success: true, data: reservation };
  } catch (error) {
    console.error('Failed to get reservation:', error);
    return { success: false, message: 'Failed to get reservation', error: error.message };
  }
};

/**
 * Get all reservations by habitation ID
 */
const getAllReservationsByHabitationId = async (habitationId) => {
  console.log('getAllReservationsByHabitationId called with habitationId:', habitationId);
  try {
    const reservations = await Reservation.find({ habitation: habitationId })
      .populate('user', '-__v')
      .sort({ reservedDateTime: -1 });

    console.log(`Found ${reservations.length} reservations for habitationId ${habitationId}`);
    return { success: true, data: reservations };
  } catch (error) {
    console.error('Failed to get reservations:', error);
    return { success: false, message: 'Failed to get reservations', error: error.message };
  }
};

/**
 * Get all *new* reservations by habitation ID (created today)
 */
const getAllNewReservationsByHabitationId = async (habitationId) => {
  console.log('getAllNewReservationsByHabitationId called with habitationId:', habitationId);
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Start of today:', today);

    const reservations = await Reservation.find({
      habitation: habitationId,
      createdAt: { $gte: today }
    }).populate('user', '-__v');

    console.log(`Found ${reservations.length} new reservations for habitationId ${habitationId}`);
    return { success: true, data: reservations };
  } catch (error) {
    console.error('Failed to get new reservations:', error);
    return { success: false, message: 'Failed to get new reservations', error: error.message };
  }
};

/**
 * Get all reservations made by a user
 */
const getAllReservationsByUserId = async (userId) => {
  console.log('getAllReservationsByUserId called with userId:', userId);
  try {
    const reservations = await Reservation.find({ user: userId })
      .populate('habitation', '-__v')
      .sort({ reservedDateTime: -1 });

    console.log(`Found ${reservations.length} reservations for userId ${userId}`);
    return { success: true, data: reservations };
  } catch (error) {
    console.error('Failed to get user reservations:', error);
    return { success: false, message: 'Failed to get user reservations', error: error.message };
  }
};

module.exports = {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationById,
  getAllNewReservationsByHabitationId,
  getAllReservationsByHabitationId,
  getAllReservationsByUserId
};
