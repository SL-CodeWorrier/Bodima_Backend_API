const Payment = require('../Models/payment');
const Reservation = require('../Models/reservation');

/**
 * Create a payment record (totalAmount will be auto-calculated via schema hook)
 */
const createPayment = async (paymentData) => {
  console.log('createPayment called with:', paymentData);

  try {
    const newPayment = new Payment(paymentData);
    console.log('New Payment instance created:', newPayment);

    await newPayment.validate();
    console.log('Payment validation successful');

    await newPayment.save();
    console.log('Payment saved:', newPayment);
    
          const newNotification = new Notification({
            user: newPayment.habitationOwnerId,
            description: `A buyer has made a payment of ${newPayment.totalAmount} ${newPayment.currencyType} for reservation ID: ${newPayment.reservation}`
            });
    
          await newNotification.save();
          console.log("Notification saved:", newNotification);

    return { success: true, message: 'Payment recorded successfully', data: newPayment };
  } catch (error) {
    console.error('Failed to create payment:', error);
    return { success: false, message: 'Failed to create payment', error: error.message };
  }
};

/**
 * Get all payments by habitationOwnerId
 */
const getPaymentsByHabitationOwnerId = async (ownerId) => {
  console.log('getPaymentsByHabitationOwnerId called with ownerId:', ownerId);

  try {
    const payments = await Payment.find({ habitationOwnerId: ownerId }).populate('reservation', '-__v');
    console.log(`Found ${payments.length} payments for ownerId ${ownerId}`);

    return { success: true, data: payments };
  } catch (error) {
    console.error('Failed to fetch payments by owner:', error);
    return { success: false, message: 'Failed to fetch payments by owner', error: error.message };
  }
};

/**
 * Get payment by reservationId
 */
const getPaymentByReservationId = async (reservationId) => {
  console.log('getPaymentByReservationId called with reservationId:', reservationId);

  try {
    const payment = await Payment.findOne({ reservation: reservationId }).populate('reservation', '-__v');
    console.log('Payment found:', payment);

    if (!payment) {
      return { success: false, message: 'No payment found for this reservation' };
    }

    return { success: true, data: payment };
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    return { success: false, message: 'Failed to fetch payment', error: error.message };
  }
};

module.exports = {
  createPayment,
  getPaymentsByHabitationOwnerId,
  getPaymentByReservationId
};
