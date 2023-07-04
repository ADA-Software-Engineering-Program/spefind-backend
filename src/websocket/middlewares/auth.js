const jwt = require('jsonwebtoken');
const User = require('../../auth/user.model')
const { decodeToken } = require('../../auth/token.service');
const logger = require('../../helpers/logger');

async function authenticate(socket) {
    const authorization = socket.handshake.headers.authorization;
    if (!authorization) { throw new Error('Authentication token not provided') }

    const token = authorization.split(' ')[1];

    const decoded_data = await decodeToken(token);
    console.log(decoded_data)
    const existing_user = await User.findById(decoded_data.user._id);
    
    if (!existing_user) { throw new Error('User not found') }

    // Show virtuals
    socket.user = existing_user;

    return socket
}

module.exports = authenticate
