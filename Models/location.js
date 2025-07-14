// models/location.model.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation',  // Reference to Habitation model
    required: true,
  },
  addressNo: {
    type: String,
    required: [true, 'Address No is required'],
    trim: true,
  },
  addressLine01: {
    type: String,
    required: [true, 'Address Line 01 is required'],
    trim: true,
  },
  addressLine02: {
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
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  nearestHabitationLatitude: {
    type: Number,
    required: false,
    min: -90,
    max: 90
  },
  nearestHabitationLongitude: {
    type: Number,
    required: false,
    min: -180,
    max: 180
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
