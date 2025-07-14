const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',     // Reference the User model
    required: true,  // Story must be linked to a User
  },
  storyImageUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => /^https?:\/\/.+/.test(v),
      message: 'Invalid URL for Story Image'
    }
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  profilePictureUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => /^https?:\/\/.+/.test(v),
      message: 'Invalid URL for Profile Picture'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
