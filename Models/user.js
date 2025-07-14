const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',            // Reference to the Auth model
    required: true          // User must be linked to an Auth document
  },
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
  },
  profilePictureUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+/.test(v); // Optional, valid URL if present
      },
      message: 'Invalid URL for Profile Picture'
    }
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  addressNo: {
    type: String,
    required: [true, 'Address No is required'],
    trim: true,
  },
  addressLine1: {
    type: String,
    required: [true, 'Address Line 01 is required'],
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true, // Optional
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
