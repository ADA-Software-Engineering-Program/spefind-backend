const User = require('../auth/user.model');
const Event = require('../events/event.model');

const createProfile = async (userId, data) => {
  if (data.eventType) {
    return await User.findByIdAndUpdate(userId, {
      $push: { eventType: [data.eventType] },
    });
  }
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

const createEvent = async (userId, data) => {
  data.userId = userId;
  const event = await Event.create(data);
  return await User.findByIdAndUpdate(userId, {
    $push: { pastEvents: event._id },
  }).populate('pastEvents');
};

module.exports = { createProfile, createEvent };
