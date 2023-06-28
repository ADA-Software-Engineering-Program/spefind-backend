const User = require('../auth/user.model');
const Event = require('../events/event.model');
const ApiError = require('../helpers/error');
const EmailSubscribe = require('../events/email.subscribe.model');

const createProfile = async (userId, data) => {
  console.log(userId, data);
  const { pastEvent, ...userData } = data;
  pastEvent.userId = userId;
  if (data.photo) {
    return await User.findByIdAndUpdate(
      userId,
      { photo: data.photo },
      { new: true }
    );
  }
  const event = await Event.create(pastEvent);
  userData.pastEvents = event._id;
  userData.isProfileCreated = true;
  return await User.findByIdAndUpdate(userId, userData, { new: true });
};

const addCoverBanner = async (userId, data) => {
  try {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to update profile...');
  }
};

const createEvent = async (userId, data) => {
  data.userId = userId;
  const event = await Event.create(data);
  return await User.findByIdAndUpdate(userId, {
    $push: { pastEvents: event._id },
  });
};

const getEvent = async (id) => {
  try {
    return await Event.findById(id).select('-userId');
  } catch (error) {
    throw new ApiError(400, 'Unable to get event...');
  }
};

const editEvent = async (eventId, editedBody) => {
  try {
    return await Event.findByIdAndUpdate(eventId, editedBody, { new: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to edit event...');
  }
};

const deleteEvent = async (userId, eventId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { pastEvents: eventId } },
      { new: true }
    );
    return await Event.findByIdAndDelete(eventId);
  } catch (error) {
    throw new ApiError(400, 'Unable to delete event...');
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id)
      .select('-password')
      .populate('pastEvents');
  } catch (error) {
    throw new ApiError(400, 'Unable to get user');
  }
};

const emailSubscribe = async (data) => {
  try {
    return await EmailSubscribe.create({ email: data });
  } catch (error) {
    throw new ApiError(400, 'Unable to add user to mailing list');
  }
};

const allSubscribers = async () => {
  try {
    return await EmailSubscribe.find();
  } catch (error) {
    throw new ApiError(400, 'Unable to fetch all subscribers...');
  }
};

module.exports = {
  allSubscribers,
  createProfile,
  createEvent,
  getEvent,
  editEvent,
  deleteEvent,
  emailSubscribe,
  addCoverBanner,
  getUserById,
};
