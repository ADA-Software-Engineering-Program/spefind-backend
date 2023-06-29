const logger = require('../helpers/logger');
const { ioWrapper } = require('./middlewares/wrapper')

const initializeSocketEventHandlers = (io, socket) => {
    try {
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
        require('../chat/chat.eventhandler')(io, socket);
    } catch (error) {
        logger.error(error)
    }
};

module.exports = { initializeSocketEventHandlers };