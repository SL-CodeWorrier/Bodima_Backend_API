const Notification = require('../Models/notification');

/**
 * Create a notification
 */
const createNotification = async (notificationData) => {
  console.log('createNotification called with:', notificationData);
  try {
    const newNotification = new Notification(notificationData);
    await newNotification.save();
    console.log('Notification created:', newNotification);

    return {
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return {
      success: false,
      message: 'Failed to create notification',
      error: error.message
    };
  }
};

/**
 * Update a notification by ID
 */
const updateNotification = async (notificationId, updateData) => {
  console.log('updateNotification called with ID:', notificationId);
  try {
    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.log('Notification not found for update');
      return { success: false, message: 'Notification not found' };
    }

    return {
      success: true,
      message: 'Notification updated successfully',
      data: updated
    };
  } catch (error) {
    console.error('Failed to update notification:', error);
    return {
      success: false,
      message: 'Failed to update notification',
      error: error.message
    };
  }
};

/**
 * Get all notifications by User ID
 */
const getAllNotificationsByUserId = async (userId) => {
  console.log('getAllNotificationsByUserId called with userId:', userId);
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }); // newest first

    return {
      success: true,
      data: notifications
    };
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return {
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    };
  }
};

const getAllNotifications = async () => {
  try {
    const notifications = await Notification.find()
        .sort({ createdAt: -1 }); // newest first

    return {
      success: true,
      data: notifications
    };
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return {
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    };
  }
};

module.exports = {
  createNotification,
  updateNotification,
  getAllNotificationsByUserId,
  getAllNotifications
};
