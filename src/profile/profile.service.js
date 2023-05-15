const User = require('../auth/user.model');
const Event = require('../events/event.model');

const createProfile = async (userId, data) => {
  const { pastEvent, ...userData } = data;
  pastEvent.userId = userId;
  const event = await Event.create(pastEvent);
  userData.pastEvents = event._id;
  return await User.findByIdAndUpdate(userId, userData, { new: true });
};

const createEvent = async (userId, data) => {
  data.userId = userId;
  const event = await Event.create(data);
  return await User.findByIdAndUpdate(userId, {
    $push: { pastEvents: event._id },
  }).populate('pastEvents');
};

module.exports = { createProfile, createEvent };
