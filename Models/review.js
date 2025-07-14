// models/review.model.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation',
    required: true
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
  },
  reviewCount: {
    type: Number,
    required: [true, 'Review count is required'],
    min: [1, 'Review count must be at least 1'],
    max: [5, 'Review count must be at most 5']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
