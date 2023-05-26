const User = require('../auth/user.model');
const Event = require('../events/event.model');
const ApiError = require('../helpers/error');
const EmailSubscribe = require('../events/email.subscribe.model');

const createProfile = async (userId, data) => {
  const { pastEvent, ...userData } = data;
  pastEvent.userId = userId;
  const event = await Event.create(pastEvent);
  userData.pastEvents = event._id;
  userData.isProfileCreated = true;
  return await User.findByIdAndUpdate(userId, userData, { new: true });
};

const createEvent = async (userId, data) => {
  data.userId = userId;
  const event = await Event.create(data);
  return await User.findByIdAndUpdate(userId, {
    $push: { pastEvents: event._id },
  });
};

const getUserById = async (id) => {
  try {
    return await User.findById(id).select('-password');
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
  emailSubscribe,
  getUserById,
};
