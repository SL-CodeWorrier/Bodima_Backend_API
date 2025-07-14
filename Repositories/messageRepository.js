const Message = require('../Models/message'); // Adjust path if needed

/**
 * Create a message
 */
const createMessage = async (messageData) => {
  console.log('createMessage called with:', messageData);
  try {
    const newMessage = new Message(messageData);
    console.log('Created Message instance:', newMessage);

    await newMessage.save();
    console.log('Message saved:', newMessage);

    return { success: true, message: 'Message sent successfully', data: newMessage };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, message: 'Failed to send message', error: error.message };
  }
};

/**
 * Delete a message by ID
 */
const deleteMessageById = async (messageId) => {
  console.log('deleteMessageById called with messageId:', messageId);
  try {
    const deleted = await Message.findByIdAndDelete(messageId);
    if (!deleted) {
      console.log('Message not found for deletion:', messageId);
      return { success: false, message: 'Message not found' };
    }
    console.log('Message deleted:', deleted);
    return { success: true, message: 'Message deleted successfully' };
  } catch (error) {
    console.error('Failed to delete message:', error);
    return { success: false, message: 'Failed to delete message', error: error.message };
  }
};

/**
 * Get all messages by receiver ID
 */
const getAllMessagesByReceiverId = async (receiverId) => {
  console.log('getAllMessagesByReceiverId called with receiverId:', receiverId);
  try {
    const messages = await Message.find({ receiver: receiverId })
      .populate('sender')
      .sort({ createdAt: -1 });

    console.log(`Found ${messages.length} messages for receiverId:`, receiverId);
    return { success: true, data: messages };
  } catch (error) {
    console.error('Failed to get messages:', error);
    return { success: false, message: 'Failed to get messages', error: error.message };
  }
};

module.exports = {
  createMessage,
  deleteMessageById,
  getAllMessagesByReceiverId,
};
