const Feed = require('./feed.model');

const createFeed = async (userId, data) => {
  const feed = data;
  feed.author = userId;
  const rawFeed = JSON.parse(JSON.stringify(feed));
  return (await Feed.create(rawFeed)).populate('author');
};

module.exports = { createFeed };
