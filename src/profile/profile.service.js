const User = require('../auth/user.model');
const Event = require('../events/event.model');

const createProfile = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

const createEvent = async (userId, data) => {
  data.userId = userId;
  console.log(data);
  const event = await Event.create(data);
  return await User.findByIdAndUpdate(userId, {
    $push: { pastEvents: event._id },
  }).populate('pastEvents');
};

module.exports = { createProfile, createEvent };
