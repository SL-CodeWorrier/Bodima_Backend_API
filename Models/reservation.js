// models/reservation.model.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // Reference to User model
    required: true,
  },
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation', // Reference to Habitation model
    required: true,
  },
  reservedDateTime: {
    type: Date,
    required: [true, 'Reserved DateTime is required'],
  },
  reservationEndDateTime: {
    type: Date,
    required: [true, 'Reservation End DateTime is required'],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
