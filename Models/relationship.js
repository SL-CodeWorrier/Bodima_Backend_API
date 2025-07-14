// models/relationship.model.js
const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Optional: prevent duplicate relationships (same user following same person twice)
relationshipSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

module.exports = mongoose.model('Relationship', relationshipSchema);
