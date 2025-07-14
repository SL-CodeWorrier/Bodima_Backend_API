// models/habitationPictures.model.js
const mongoose = require('mongoose');

const habitationPicturesSchema = new mongoose.Schema({
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation', // Reference to Habitation model
    required: true,
  },
  pictureUrl: {
    type: String,
    required: [true, 'Picture URL is required'],
    trim: true,
    validate: {
      validator: v => /^https?:\/\/.+/.test(v),
      message: 'Invalid URL for Picture'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HabitationPictures', habitationPicturesSchema);
