require('dotenv').config();

const Auth = require('../Models/auth');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  console.log('Registering user with data:', userData);
  const { email, username, password } = userData;

  try {
    const existingUser = await Auth.findOne({ $or: [{ email }, { username }] });
    console.log('Existing user search result:', existingUser);

    if (existingUser) {
      console.log('User already exists with email or username');
      return { success: false, message: 'Email or Username already exists' };
    }

    const newUser = new Auth({ email, username, password });
    console.log('New user instance created:', newUser);

    await newUser.save();
    console.log('New user saved to DB');

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, message: 'Registration failed', error: error.message };
  }
};

/**
 * Login user
 */
const loginUser = async (credentials) => {
  console.log('Login attempt with credentials:', credentials);
  const { emailOrUsername, password } = credentials;

  try {
    const user = await Auth.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    console.log('User found for login:', user);

    if (!user || !(await user.comparePassword(password))) {
      console.log('Invalid credentials');
      return { success: false, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('JWT token generated:', token);

    const userProfile = await User.findOne({ auth: user._id });
    console.log('User profile :', userProfile);

    return {
      success: true,
      message: 'Login successful',
      token,
      isUserProfileAvailable: userProfile !== null,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: 'Login failed', error: error.message };
  }
};

/**
 * Delete user
 */
const deleteUser = async (userId) => {
  console.log('Attempting to delete user with ID:', userId);

  try {
    const deletedUser = await Auth.findByIdAndDelete(userId);
    console.log('Deleted user:', deletedUser);

    if (!deletedUser) {
      console.log('User not found for deletion');
      return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Deletion failed:', error);
    return { success: false, message: 'Deletion failed', error: error.message };
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (userId) => {
  console.log('Getting current user with ID:', userId);

  try {
    const user = await Auth.findById(userId).select('-password');
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    return { success: false, message: 'Failed to retrieve user', error: error.message };
  }
};

/**
 * Update user with password
 */
const updateUserWithPassword = async (userId, updateData) => {
  console.log('Updating user with password. ID:', userId, 'Update data:', updateData);

  try {
    const { email, username, password } = updateData;

    const conflictUser = await Auth.findOne({
      _id: { $ne: userId },
      $or: [
        email ? { email } : null,
        username ? { username } : null
      ].filter(Boolean)
    });
    console.log('Conflict check result:', conflictUser);

    if (conflictUser) {
      console.log('Conflict with another user on email/username');
      return { success: false, message: 'Email or Username already in use by another user' };
    }

    const user = await Auth.findById(userId);
    console.log('User found for update:', user);

    if (!user) {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }

    user.email = email ?? user.email;
    user.username = username ?? user.username;
    user.password = password; // will trigger pre-save password hashing
    await user.save();
    console.log('User updated and saved');

    return {
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, message: 'Update failed', error: error.message };
  }
};

/**
 * Update user without password
 */
const updateUserWithoutPassword = async (userId, updateData) => {
  console.log('Updating user without password. ID:', userId, 'Update data:', updateData);

  try {
    const { email, username } = updateData;

    const conflictUser = await Auth.findOne({
      _id: { $ne: userId },
      $or: [
        email ? { email } : null,
        username ? { username } : null
      ].filter(Boolean)
    });
    console.log('Conflict check result:', conflictUser);

    if (conflictUser) {
      console.log('Conflict with another user on email/username');
      return { success: false, message: 'Email or Username already in use by another user' };
    }

    const updatedUser = await Auth.findByIdAndUpdate(
      userId,
      { email, username },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, message: 'Update failed', error: error.message };
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  getCurrentUser,
  updateUserWithPassword,
  updateUserWithoutPassword
};
