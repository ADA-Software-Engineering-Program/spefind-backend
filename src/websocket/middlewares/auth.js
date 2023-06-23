const jwt = require('jsonwebtoken');
const User = require('../../auth/user.model')
const { decodeToken } = require('../../auth/token.service');

async function authenticate(socket) {
    try {
        const token = socket.handshake.query?.access_token;
        if (!token) { throw new Error('Authentication token not provided') }

        const decoded_data = decodeToken(token);
        const existing_user = await User.findById(decoded_data.sub);

        if(!existing_user) { throw new Error('User not found') }

        // Show virtuals
        socket.user = existing_user;

        return socket
    } catch (err) {
        console.log(err)
        return err
    }
}

module.exports = authenticate
