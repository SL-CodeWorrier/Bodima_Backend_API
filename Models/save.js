// models/save.model.js
const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
  habitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitation',
    required: true
  },
  savedUserIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Save', saveSchema);
