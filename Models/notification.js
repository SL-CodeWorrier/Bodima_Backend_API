const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  isTouched: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Utility to get date boundaries
function getDateWithoutTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Virtual: isToday
notificationSchema.virtual('isToday').get(function () {
  const created = getDateWithoutTime(this.createdAt);
  const today = getDateWithoutTime(new Date());
  return created.getTime() === today.getTime();
});

// Virtual: isYesterday
notificationSchema.virtual('isYesterday').get(function () {
  const created = getDateWithoutTime(this.createdAt);
  const today = getDateWithoutTime(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return created.getTime() === yesterday.getTime();
});

// Virtual: isPast
notificationSchema.virtual('isPast').get(function () {
  const created = getDateWithoutTime(this.createdAt);
  const today = getDateWithoutTime(new Date());
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);
  return created < dayBeforeYesterday;
});

module.exports = mongoose.model('Notification', notificationSchema);
