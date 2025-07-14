const User = require('../Models/user');

/**
 * Get current user by Auth ID (foreign key)
 */
const getCurrentUser = async (authId) => {
  console.log('getCurrentUser called with authId:', authId);
  try {
    const user = await User.findOne({ auth: authId }).populate('auth', '-password');
    console.log('User found:', user);

    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    return { success: false, message: 'Failed to retrieve user', error: error.message };
  }
};

/**
 * Create new user profile linked to Auth
 */
const createUser = async (authId, userData) => {
  console.log('createUser called with:', { authId, userData });
  try {
    const existingUser = await User.findOne({ auth: authId });
    console.log('Existing user check:', existingUser);

    if (existingUser) {
      return { success: false, message: 'User profile already exists' };
    }

    const newUser = new User({
      auth: authId,
      ...userData
    });

    await newUser.save();
    console.log('New user created:', newUser);

    return { success: true, message: 'User profile created successfully', data: newUser };
  } catch (error) {
    console.error('User creation failed:', error);
    return { success: false, message: 'User creation failed', error: error.message };
  }
};

/**
 * Update user profile by Auth ID
 */
const updateUser = async (authId, updateData) => {
  console.log('updateUser called with:', { authId, updateData });
  try {
    const updatedUser = await User.findOneAndUpdate(
      { auth: authId },
      updateData,
      { new: true, runValidators: true, context: 'query' }
    ).populate('auth', '-password');
    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      return { success: false, message: 'User profile not found' };
    }

    return { success: true, message: 'User profile updated successfully', data: updatedUser };
  } catch (error) {
    console.error('User update failed:', error);
    return { success: false, message: 'User update failed', error: error.message };
  }
};

/**
 * Delete user by Auth ID
 */
const deleteUser = async (authId) => {
  console.log('deleteUser called with authId:', authId);
  try {
    const deletedUser = await User.findOneAndDelete({ auth: authId });
    console.log('Deleted user:', deletedUser);

    if (!deletedUser) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Deletion failed:', error);
    return { success: false, message: 'Deletion failed', error: error.message };
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser
};
