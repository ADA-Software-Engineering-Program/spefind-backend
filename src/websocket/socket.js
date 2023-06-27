const logger = require('../helpers/logger');
const { ioWrapper } = require('./middlewares/wrapper')

const initializeSocketEventHandlers = (io, socket) => {
    socket.on('message', ioWrapper(() => {
        socket.send({ message: 'Welcome' })
    }, socket));

    socket.on('error', ioWrapper(() => {
        socket.send({ error: 'An error occured' })
    }, socket));

    socket.on('disconnect', ioWrapper(() => {
        logger.info(socket.user.email + ': disconnected');

        socket.disconnect();
        removeClient(socket);
    }, socket));

    // Initialize socket event handlers
    // require('./websocket/event-handlers/chat.events')(io, socket);
};

module.exports = { initializeSocketEventHandlers };