const Story = require('../Models/userStory');

/**
 * Get all stories with populated user info
 */
const getAllStories = async () => {
  console.log('getAllStories called');
  try {
    const stories = await Story.find()
      .populate({
        path: 'user',
        select: '-__v -createdAt -updatedAt'
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${stories.length} stories`);
    return { success: true, data: stories };
  } catch (error) {
    console.error('Failed to get stories:', error);
    return { success: false, message: 'Failed to get stories', error: error.message };
  }
};

/**
 * Get a single story by Story ID with populated user info
 */
const getUserStoryById = async (storyId) => {
  console.log('getUserStoryById called with storyId:', storyId);
  try {
    const story = await Story.findById(storyId)
      .populate({
        path: 'user',
        select: '-__v -createdAt -updatedAt'
      });

    if (!story) {
      console.log('Story not found');
      return { success: false, message: 'Story not found' };
    }

    console.log('Story found:', story);
    return { success: true, data: story };
  } catch (error) {
    console.error('Failed to get story:', error);
    return { success: false, message: 'Failed to get story', error: error.message };
  }
};

/**
 * Create a new story
 */
const createStory = async (storyData) => {
  console.log('createStory called with data:', storyData);
  try {
    const newStory = new Story(storyData);
    await newStory.save();

    console.log('Story created:', newStory);
    return { success: true, message: 'Story created successfully', data: newStory };
  } catch (error) {
    console.error('Story creation failed:', error);
    return { success: false, message: 'Story creation failed', error: error.message };
  }
};

/**
 * Update an existing story by ID
 */
const updateStory = async (storyId, updateData) => {
  console.log('updateStory called with:', { storyId, updateData });
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedStory) {
      console.log('Story not found for update');
      return { success: false, message: 'Story not found' };
    }

    console.log('Story updated:', updatedStory);
    return { success: true, message: 'Story updated successfully', data: updatedStory };
  } catch (error) {
    console.error('Story update failed:', error);
    return { success: false, message: 'Story update failed', error: error.message };
  }
};

/**
 * Delete a story by Story ID
 */
const deleteStory = async (storyId) => {
  console.log('deleteStory called with storyId:', storyId);
  try {
    const deletedStory = await Story.findByIdAndDelete(storyId);

    if (!deletedStory) {
      console.log('Story not found for deletion');
      return { success: false, message: 'Story not found' };
    }

    console.log('Story deleted:', deletedStory);
    return { success: true, message: 'Story deleted successfully' };
  } catch (error) {
    console.error('Deletion failed:', error);
    return { success: false, message: 'Deletion failed', error: error.message };
  }
};

module.exports = {
  getAllStories,
  getUserStoryById,
  createStory,
  updateStory,
  deleteStory
};
