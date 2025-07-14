const HabitationFeature = require('../Models/habitationFeature');
const Habitation = require('../Models/habitation');

/**
 * Create habitation feature
 */
const createHabitationFeature = async (habitationId, featureData) => {
  console.log('Creating habitation feature for:', habitationId);

  try {
    const habitationExists = await Habitation.findById(habitationId);
    if (!habitationExists) {
      return { success: false, message: 'Habitation not found' };
    }

    const existingFeature = await HabitationFeature.findOne({ habitation: habitationId });
    if (existingFeature) {
      return { success: false, message: 'Feature already exists for this habitation' };
    }

    const newFeature = new HabitationFeature({ habitation: habitationId, ...featureData });
    await newFeature.save();

    return {
      success: true,
      message: 'Habitation feature created successfully',
      data: newFeature
    };
  } catch (error) {
    console.error('Failed to create habitation feature:', error);
    return { success: false, message: 'Failed to create habitation feature', error: error.message };
  }
};

/**
 * Update habitation feature by habitation ID
 */
const updateFeatureByHabitationId = async (habitationId, updateData) => {
  console.log('Updating habitation feature for:', habitationId);

  try {
    const updatedFeature = await HabitationFeature.findOneAndUpdate(
      { habitation: habitationId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFeature) {
      return { success: false, message: 'Feature not found for this habitation' };
    }

    return {
      success: true,
      message: 'Habitation feature updated successfully',
      data: updatedFeature
    };
  } catch (error) {
    console.error('Failed to update habitation feature:', error);
    return { success: false, message: 'Failed to update habitation feature', error: error.message };
  }
};

/**
 * Delete habitation feature by habitation ID
 */
const deleteFeatureByHabitationId = async (habitationId) => {
  console.log('Deleting habitation feature for:', habitationId);

  try {
    const deletedFeature = await HabitationFeature.findOneAndDelete({ habitation: habitationId });

    if (!deletedFeature) {
      return { success: false, message: 'Feature not found for this habitation' };
    }

    return { success: true, message: 'Habitation feature deleted successfully' };
  } catch (error) {
    console.error('Failed to delete habitation feature:', error);
    return { success: false, message: 'Failed to delete habitation feature', error: error.message };
  }
};

/**
 * Get habitation feature by habitation ID
 */
const getFeatureByHabitationId = async (habitationId) => {
  console.log('Fetching feature for habitation ID:', habitationId);

  try {
    const feature = await HabitationFeature.findOne({ habitation: habitationId });

    if (!feature) {
      return { success: false, message: 'Feature not found for this habitation' };
    }

    return { success: true, data: feature };
  } catch (error) {
    console.error('Failed to fetch habitation feature:', error);
    return { success: false, message: 'Failed to get habitation feature', error: error.message };
  }
};

module.exports = {
  createHabitationFeature,
  updateFeatureByHabitationId,
  deleteFeatureByHabitationId,
  getFeatureByHabitationId
};
