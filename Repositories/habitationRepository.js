const Habitation = require('../Models/habitation');
const HabitationPictures = require('../Models/habitationPictures');
const Notification = require('../Models/notification');

/**
 * Add a picture to a habitation
 */
const addHabitationPicture = async (habitationId, pictureUrl) => {
  console.log('Adding picture to habitation:', habitationId, pictureUrl);

  try {
    const habitationExists = await Habitation.findById(habitationId);
    console.log('Habitation existence check:', habitationExists);

    if (!habitationExists) {
      return { success: false, message: 'Habitation not found' };
    }

    const newPicture = new HabitationPictures({ habitation: habitationId, pictureUrl });
    console.log('New HabitationPicture created:', newPicture);

    await newPicture.save();
    console.log('New picture saved');

    return { success: true, message: 'Picture added successfully', data: newPicture };
  } catch (error) {
    console.error('Failed to add picture:', error);
    return { success: false, message: 'Failed to add picture', error: error.message };
  }
};

/**
 * Remove a habitation picture by its ID
 */
const removeHabitationPicture = async (pictureId) => {
  console.log('Removing habitation picture with ID:', pictureId);

  try {
    const deletedPicture = await HabitationPictures.findByIdAndDelete(pictureId);
    console.log('Deleted picture:', deletedPicture);

    if (!deletedPicture) {
      return { success: false, message: 'Picture not found' };
    }

    return { success: true, message: 'Picture removed successfully' };
  } catch (error) {
    console.error('Failed to remove picture:', error);
    return { success: false, message: 'Failed to remove picture', error: error.message };
  }
};

/**
 * Get all habitations
 */
const getAllHabitations = async () => {
  console.log('Fetching all habitations...');

  try {
    // Step 1: Get all habitations
    const habitations = await Habitation.find()
      .populate('user', '-__v -createdAt -updatedAt')
      .sort({ createdAt: -1 });

    // Step 2: For each habitation, fetch its related pictures
    const habitationsWithPictures = await Promise.all(
      habitations.map(async (habitation) => {
        const pictures = await HabitationPictures.find({ habitation: habitation._id }, '-__v -createdAt -updatedAt');
        return {
          ...habitation.toObject(),
          pictures, // Add pictures array to the habitation object
        };
      })
    );

    console.log('Habitations fetched:', habitationsWithPictures.length);
    return { success: true, data: habitationsWithPictures };
  } catch (error) {
    console.error('Failed to get habitations:', error);
    return { success: false, message: 'Failed to get habitations', error: error.message };
  }
};

/**
 * Get all habitations created this month
 */
const getAllHabitationsThisMonth = async () => {
  console.log('Fetching habitations created this month...');

  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    console.log('Start of month:', startOfMonth);

    // Step 1: Get habitations created since the start of the month
    const habitations = await Habitation.find({
      createdAt: { $gte: startOfMonth }
    })
      .populate('user', '-__v -createdAt -updatedAt')
      .sort({ createdAt: -1 });

    // Step 2: Add pictures for each habitation
    const habitationsWithPictures = await Promise.all(
      habitations.map(async (habitation) => {
        const pictures = await HabitationPictures.find(
          { habitation: habitation._id },
          '-__v -createdAt -updatedAt'
        );

        return {
          ...habitation.toObject(),
          pictures,
        };
      })
    );

    console.log('Habitations this month:', habitationsWithPictures.length);
    return { success: true, data: habitationsWithPictures };
  } catch (error) {
    console.error('Failed to get habitations this month:', error);
    return {
      success: false,
      message: 'Failed to get habitations this month',
      error: error.message,
    };
  }
};

/**
 * Get habitation by ID
 */
const getHabitationById = async (habitationId) => {
  console.log('Fetching habitation by ID:', habitationId);

  try {
    // Step 1: Find the habitation by ID and populate user
    const habitation = await Habitation.findById(habitationId)
      .populate('user', '-__v -createdAt -updatedAt');

    if (!habitation) {
      console.log('Habitation not found');
      return { success: false, message: 'Habitation not found' };
    }

    // Step 2: Find related pictures
    const pictures = await HabitationPictures.find(
      { habitation: habitation._id },
      '-__v -createdAt -updatedAt'
    );

    // Step 3: Return habitation with pictures included
    return {
      success: true,
      data: {
        ...habitation.toObject(),
        pictures,
      }
    };
  } catch (error) {
    console.error('Failed to get habitation by ID:', error);
    return {
      success: false,
      message: 'Failed to get habitation',
      error: error.message
    };
  }
};

/**
 * Get all habitations by user ID
 */
const getHabitationsByUserId = async (userId) => {
  console.log('Fetching habitations for user ID:', userId);

  try {
    // Step 1: Find habitations by user ID
    const habitations = await Habitation.find({ user: userId })
      .populate('user', '-__v -createdAt -updatedAt')
      .sort({ createdAt: -1 });

    // Step 2: For each habitation, fetch its related pictures
    const habitationsWithPictures = await Promise.all(
      habitations.map(async (habitation) => {
        const pictures = await HabitationPictures.find(
          { habitation: habitation._id },
          '-__v -createdAt -updatedAt'
        );

        return {
          ...habitation.toObject(),
          pictures,
        };
      })
    );

    console.log('Habitations by user:', habitationsWithPictures.length);
    return { success: true, data: habitationsWithPictures };
  } catch (error) {
    console.error('Failed to get habitations by user:', error);
    return {
      success: false,
      message: 'Failed to get user habitations',
      error: error.message
    };
  }
};

/**
 * Create new habitation
 */
const createHabitation = async (habitationData) => {
  console.log('Creating habitation with data:', habitationData);

  try {
    const newHabitation = new Habitation(habitationData);
    console.log('New habitation instance:', newHabitation);

    const isSaved = await newHabitation.save();
    
    if(isSaved && isSaved._id !== null){
      console.log('Habitation saved to DB');

      const newNotification = new Notification({
          description: `A new habitation has been created called ${newHabitation.name}`
        });

      await newNotification.save();
      console.log("Notification saved:", newNotification);
    }

    return { success: true, message: 'Habitation created successfully', data: newHabitation };
  } catch (error) {
    console.error('Failed to create habitation:', error);
    return { success: false, message: 'Failed to create habitation', error: error.message };
  }
};

/**
 * Update habitation by ID
 */
const updateHabitation = async (habitationId, updateData) => {
  console.log('Updating habitation:', habitationId, 'With:', updateData);

  try {
    const updatedHabitation = await Habitation.findByIdAndUpdate(
      habitationId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Updated habitation:', updatedHabitation);

    if (!updatedHabitation) {
      return { success: false, message: 'Habitation not found' };
    }

    return { success: true, message: 'Habitation updated successfully', data: updatedHabitation };
  } catch (error) {
    console.error('Failed to update habitation:', error);
    return { success: false, message: 'Failed to update habitation', error: error.message };
  }
};

/**
 * Delete habitation by ID
 */
const deleteHabitation = async (habitationId) => {
  console.log('Deleting habitation with ID:', habitationId);

  try {
    const deletedHabitation = await Habitation.findByIdAndDelete(habitationId);
    console.log('Deleted habitation:', deletedHabitation);

    if (!deletedHabitation) {
      return { success: false, message: 'Habitation not found' };
    }

    return { success: true, message: 'Habitation deleted successfully' };
  } catch (error) {
    console.error('Failed to delete habitation:', error);
    return { success: false, message: 'Failed to delete habitation', error: error.message };
  }
};

module.exports = {
  getAllHabitations,
  getAllHabitationsThisMonth,
  getHabitationById,
  getHabitationsByUserId,
  createHabitation,
  updateHabitation,
  deleteHabitation,
  addHabitationPicture,
  removeHabitationPicture
};
