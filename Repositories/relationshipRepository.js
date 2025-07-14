const Relationship = require('../Models/relationship');
const User = require('../Models/user');

/**
 * Create a follow relationship
 */
const createRelationship = async (followerId, followingId) => {
  console.log('createRelationship called with followerId:', followerId, 'followingId:', followingId);

  try {
    if (followerId === followingId) {
      console.log('Attempt to follow self detected');
      return { success: false, message: "You cannot follow yourself" };
    }

    const newRelationship = new Relationship({ followerId, followingId });
    console.log('Created new Relationship instance:', newRelationship);

    await newRelationship.save();
    console.log('Relationship saved successfully');

    return { success: true, message: "Followed successfully" };
  } catch (error) {
    console.error('Error in createRelationship:', error);

    if (error.code === 11000) {
      console.log('Duplicate key error: already following this user');
      return { success: false, message: "Already following this user" };
    }
    return { success: false, message: "Failed to follow user", error: error.message };
  }
};

/**
 * Delete a follow relationship
 */
const deleteRelationship = async (followerId, followingId) => {
  console.log('deleteRelationship called with followerId:', followerId, 'followingId:', followingId);

  try {
    const deleted = await Relationship.findOneAndDelete({ followerId, followingId });
    console.log('Deleted relationship:', deleted);

    if (!deleted) {
      return { success: false, message: "Follow relationship not found" };
    }

    return { success: true, message: "Unfollowed successfully" };
  } catch (error) {
    console.error('Error in deleteRelationship:', error);
    return { success: false, message: "Failed to unfollow user", error: error.message };
  }
};

/**
 * Get users that the current user is following, with total count
 */
const getFollowingUsersWithCountByCurrentUserId = async (currentUserId) => {
  console.log('getFollowingUsersWithCountByCurrentUserId called with currentUserId:', currentUserId);

  try {
    const relationships = await Relationship.find({ followerId: currentUserId }).populate('followingId', '-__v');
    console.log(`Found ${relationships.length} following relationships`);

    const followingUsers = relationships.map(r => r.followingId);
    console.log('Following users extracted:', followingUsers);

    const count = followingUsers.length;

    return { success: true, count, data: followingUsers };
  } catch (error) {
    console.error('Error in getFollowingUsersWithCountByCurrentUserId:', error);
    return { success: false, message: 'Failed to get following users', error: error.message };
  }
};

/**
 * Get users who follow the current user, with total count
 */
const getFollowersWithCountByCurrentUserId = async (currentUserId) => {
  console.log('getFollowersWithCountByCurrentUserId called with currentUserId:', currentUserId);

  try {
    const relationships = await Relationship.find({ followingId: currentUserId }).populate('followerId', '-__v');
    console.log(`Found ${relationships.length} follower relationships`);

    const followers = relationships.map(r => r.followerId);
    console.log('Followers extracted:', followers);

    const count = followers.length;

    return { success: true, count, data: followers };
  } catch (error) {
    console.error('Error in getFollowersWithCountByCurrentUserId:', error);
    return { success: false, message: 'Failed to get followers', error: error.message };
  }
};

module.exports = {
  createRelationship,
  deleteRelationship,
  getFollowingUsersWithCountByCurrentUserId,
  getFollowersWithCountByCurrentUserId
};
