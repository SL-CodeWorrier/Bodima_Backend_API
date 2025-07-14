const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  habitationOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Refers to User model
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',  // Refers to Reservation model
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  currencyType: {
    type: String,
    required: [true, 'Currency Type is required'],
    trim: true,
  },
  amountType: {
    type: String,
    required: [true, 'Amount Type is required'],  // e.g. "rent", "deposit"
    trim: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: false,
    min: 0,
  }
}, {
  timestamps: true
});

// Calculate totalAmount before save
paymentSchema.pre('validate', function(next) {
  // Ensure amount and discount are numbers
  const amount = this.amount || 0;
  const discount = this.discount || 0;

  if (discount > amount) {
    return next(new Error('Discount cannot be greater than amount'));
  }

  this.totalAmount = amount - discount;
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
