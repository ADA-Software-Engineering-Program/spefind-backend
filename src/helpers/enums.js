const getEnumsArray = (object) => {
  return [...Object.values(object)];
};

const USER_ROLE = Object.freeze({ USER: 'user', ADMIN: 'admin' });

const TRANSACTION_STATUS = Object.freeze({
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  FAILED: 'failed',
});

const FEED_TYPE = Object.freeze({
  ORIGINAL: 'original',
  REPOST: 'repost',
  SECOND_REPOST: 'second_repost',
});

module.exports = { USER_ROLE, FEED_TYPE, TRANSACTION_STATUS, getEnumsArray };
