const mongoose = require('mongoose');

const habitationFeatureSchema = new mongoose.Schema({
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation',   // Reference to the Habitation model
    required: true,
  },
  sqft: {
    type: Number,
    required: [true, 'Square footage is required'],
  },
  familyType: {
    type: String,
    required: [true, 'Family type is required'],
    trim: true,
  },
  windowsCount: {
    type: Number,
    required: [true, 'Windows count is required'],
    min: 0,
  },
  smallBedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  largeBedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  chairCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tableCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isElectricityAvailable: {
    type: Boolean,
    default: false,
  },
  isWachineMachineAvailable: {  // Typo in attribute name
    type: Boolean,
    default: false,
  },
  isWaterAvailable: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HabitationFeature', habitationFeatureSchema);