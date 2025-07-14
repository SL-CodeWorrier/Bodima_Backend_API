const Location = require('../Models/location');
const Habitation = require('../Models/habitation');
const HabitationPictures = require('../Models/habitationPictures'); // Assuming this is the model for habitation pictures

/**
 * Get location by Habitation ID
 */
const getLocationByHabitationId = async (habitationId) => {
  console.log('getLocationByHabitationId called with habitationId:', habitationId);
  try {
    const location = await Location.findOne({ habitation: habitationId }).populate('habitation');
    console.log('Found location:', location);

    if (!location) {
      return { success: false, message: 'Location not found for this habitation' };
    }

    return { success: true, data: location };
  } catch (error) {
    console.error('Error in getLocationByHabitationId:', error);
    return { success: false, message: 'Failed to get location', error: error.message };
  }
};

/**
 * Get all habitations in a given district
 */
const getHabitationsByDistrict = async (district) => {
  console.log('getHabitationsByDistrict called with district:', district);

  try {
    // Step 1: Get all locations in the district and populate their habitations and users
    const locations = await Location.find({ district }).populate({
      path: 'habitation',
      populate: { path: 'user', select: '-__v -createdAt -updatedAt' }
    });

    console.log(`Found ${locations.length} locations in district ${district}`);

    // Step 2: For each location with habitation, attach pictures and include location
    const habitationsWithDetails = await Promise.all(
      locations.map(async (location) => {
        const habitation = location.habitation;

        if (!habitation) return null;

        const pictures = await HabitationPictures.find(
          { habitation: habitation._id },
          '-__v -createdAt -updatedAt'
        );

        return {
          ...habitation.toObject(),
          pictures,
          location: {
            id: location._id,
            habitation: location.habitation._id,
            addressNo: location.addressNo,
            addressLine01: location.addressLine01,
            addressLine02: location.addressLine02,
            city: location.city,
            district: location.district,
            latitude: location.latitude,
            longitude: location.longitude,
            nearestHabitationLatitude: location.nearestHabitationLatitude,
            nearestHabitationLongitude: location.nearestHabitationLongitude
          }
        };
      })
    );

    // Remove any nulls (invalid or missing habitation refs)
    const filtered = habitationsWithDetails.filter(item => item !== null);

    console.log('Extracted habitations with full info:', filtered.length);

    return { success: true, data: filtered };
  } catch (error) {
    console.error('Error in getHabitationsByDistrict:', error);
    return {
      success: false,
      message: 'Failed to get habitations by district',
      error: error.message
    };
  }
};

/**
 * Create a new location
 */
const createLocation = async (locationData) => {
  console.log('createLocation called with data:', locationData);
  try {
    const newLocation = new Location(locationData);
    console.log('New Location instance:', newLocation);

    await newLocation.save();
    console.log('Location saved');

    return { success: true, message: 'Location created successfully', data: newLocation };
  } catch (error) {
    console.error('Error in createLocation:', error);
    return { success: false, message: 'Failed to create location', error: error.message };
  }
};

/**
 * Update location by Habitation ID
 */
const updateLocation = async (habitationId, updateData) => {
  console.log('updateLocation called for habitationId:', habitationId, 'with data:', updateData);
  try {
    const updatedLocation = await Location.findOneAndUpdate(
      { habitation: habitationId },
      updateData,
      { new: true, runValidators: true }
    );
    console.log('Updated location:', updatedLocation);

    if (!updatedLocation) {
      return { success: false, message: 'Location not found' };
    }

    return { success: true, message: 'Location updated successfully', data: updatedLocation };
  } catch (error) {
    console.error('Error in updateLocation:', error);
    return { success: false, message: 'Failed to update location', error: error.message };
  }
};

/**
 * Delete location by Habitation ID
 */
const deleteLocation = async (habitationId) => {
  console.log('deleteLocation called with habitationId:', habitationId);
  try {
    const deletedLocation = await Location.findOneAndDelete({ habitation: habitationId });
    console.log('Deleted location:', deletedLocation);

    if (!deletedLocation) {
      return { success: false, message: 'Location not found' };
    }

    return { success: true, message: 'Location deleted successfully' };
  } catch (error) {
    console.error('Error in deleteLocation:', error);
    return { success: false, message: 'Failed to delete location', error: error.message };
  }
};

/**
 * Find nearest habitation by coordinates
 */
const getHabitationByNearestCoordinates = async (nearestHabitationLatitude, nearestHabitationLongitude) => {
  console.log(
    'getHabitationByNearestCoordinates called with nearestHabitationLatitude:',
    nearestHabitationLatitude,
    'nearestHabitationLongitude:',
    nearestHabitationLongitude
  );

  try {
    // Step 1: Find location with given nearest coordinates
   const matchingLocations = await Location.find({
      $expr: {
        $and: [
          { $eq: ['$latitude', '$nearestHabitationLatitude'] },
          { $eq: ['$longitude', '$nearestHabitationLongitude'] }
        ]
      }
    });

    const location = matchingLocations[0]; // Assuming we take the first match

    console.log('Found location:', location);

    if (!location) {
      return {
        success: false,
        message: 'No habitation found with given nearest coordinates'
      };
    }

    // Step 2: Get the habitation and populate user
    const habitation = await Habitation.findById(location.habitation)
      .populate('user', '-__v -createdAt -updatedAt');

    if (!habitation) {
      return {
        success: false,
        message: 'Habitation not found for the given location'
      };
    }

    // Step 3: Get related pictures
    const pictures = await HabitationPictures.find(
      { habitation: habitation._id },
      '-__v -createdAt -updatedAt'
    );

    // Step 4: Return combined data with location details included
    return {
      success: true,
      data: {
        ...habitation.toObject(),
        pictures,
        location: {
          id: location._id,
          habitation: location.habitation._id,
          addressNo: location.addressNo,
          addressLine01: location.addressLine01,
          addressLine02: location.addressLine02,
          city: location.city,
          district: location.district,
          latitude: location.latitude,
          longitude: location.longitude,
          nearestHabitationLatitude: location.nearestHabitationLatitude,
          nearestHabitationLongitude: location.nearestHabitationLongitude,
          createdAt: location.createdAt,
          updatedAt: location.updatedAt,
        }
      }
    };
  } catch (error) {
    console.error('Error in getHabitationByNearestCoordinates:', error);
    return {
      success: false,
      message: 'Failed to find habitation',
      error: error.message
    };
  }
};


module.exports = {
  getLocationByHabitationId,
  getHabitationsByDistrict,
  createLocation,
  updateLocation,
  deleteLocation,
  getHabitationByNearestCoordinates
};
