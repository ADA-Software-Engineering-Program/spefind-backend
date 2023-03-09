const getEnumsArray = (object) => {
  return [...Object.values(object)];
};

const USER_ROLE = Object.freeze({ USER: 'user', ADMIN: 'admin' });

const TRANSACTION_STATUS = Object.freeze({
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  FAILED: 'failed',
});

module.exports = { USER_ROLE, TRANSACTION_STATUS, getEnumsArray };
