const Save = require('../Models/save');
const Habitation = require('../Models/habitation');
const User = require('../Models/user');

/**
 * Save (or update) a user's saved habitation
 */
const createSave = async (habitationId, userId) => {
  console.log('createSave called with:', { habitationId, userId });

  try {
    let saveDoc = await Save.findOne({ habitation: habitationId });
    console.log('Found saveDoc:', saveDoc);

    if (!saveDoc) {
      // Create new Save doc
      saveDoc = new Save({
        habitation: habitationId,
        savedUserIds: [userId]
      });
      console.log('Created new saveDoc:', saveDoc);
    } else if (!saveDoc.savedUserIds.some(id => id.toString() === userId.toString())) {
      // Add userId if not already saved
      saveDoc.savedUserIds.push(userId);
      console.log(`Added userId ${userId} to savedUserIds`);
    } else {
      console.log('User already saved this habitation');
    }

    await saveDoc.save();
    console.log('Saved saveDoc:', saveDoc);

    return {
      success: true,
      message: 'Habitation saved successfully',
      data: saveDoc
    };

  } catch (error) {
    console.error('Failed to save habitation:', error);
    return {
      success: false,
      message: 'Failed to save habitation',
      error: error.message
    };
  }
};

/**
 * Remove a saved habitation by user
 */
const deleteSave = async (habitationId, userId) => {
  console.log('deleteSave called with:', { habitationId, userId });

  try {
    // Step 1: Find the save document that matches both habitation and user
    const saveDoc = await Save.findOne({
      habitation: habitationId,
      savedUserIds: userId
    });

    if (!saveDoc) {
      console.log('No matching Save document found');
      return {
        success: false,
        message: 'No save found for this user and habitation'
      };
    }

    // Step 2: Delete the entire Save document using its ID
    await Save.findByIdAndDelete(saveDoc._id);
    console.log('Save document deleted:', saveDoc._id);

    return {
      success: true,
      message: 'Save entry deleted successfully',
      data: saveDoc
    };

  } catch (error) {
    console.error('Error deleting save document:', error);
    return {
      success: false,
      message: 'Failed to delete save',
      error: error.message
    };
  }
};

/**
 * Get number of users who saved a specific habitation
 */
const getSavedUserIdCountByHabitationId = async (habitationId) => {
  console.log('getSavedUserIdCountByHabitationId called with:', habitationId);
  try {
    const saveDoc = await Save.findOne({ habitation: habitationId });
    const count = saveDoc ? saveDoc.savedUserIds.length : 0;
    console.log('Saved user count:', count);

    return { success: true, count };
  } catch (error) {
    console.error('Failed to get saved user count:', error);
    return { success: false, message: 'Failed to get count', error: error.message };
  }
};

/**
 * Get number of habitations saved by a specific user
 */
const getHabitationsCountBySavedUserId = async (userId) => {
  console.log('getHabitationsCountBySavedUserId called with:', userId);
  try {
    const count = await Save.countDocuments({ savedUserIds: userId });
    console.log('Habitations count saved by user:', count);

    return { success: true, count };
  } catch (error) {
    console.error('Failed to get habitation count by user:', error);
    return { success: false, message: 'Failed to get habitation count', error: error.message };
  }
};

/**
 * Get all habitations saved by a specific user
 */
const getHabitationsBySavedUserId = async (userId) => {
  console.log('getHabitationsBySavedUserId called with:', userId);
  try {
    const savedDocs = await Save.find({ savedUserIds: userId }).populate('habitation');
    console.log(`Found ${savedDocs.length} saved habitations for user`);

    const habitations = savedDocs.map(doc => doc.habitation);
    return { success: true, data: habitations };
  } catch (error) {
    console.error('Failed to get saved habitations:', error);
    return { success: false, message: 'Failed to get saved habitations', error: error.message };
  }
};

module.exports = {
  createSave,
  deleteSave,
  getSavedUserIdCountByHabitationId,
  getHabitationsCountBySavedUserId,
  getHabitationsBySavedUserId
};
