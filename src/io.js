const { createServer } = require('http');
const { Server } = require('socket.io');
const socketAsyncWrapper = require('./websocket/middlewares/wrapper').default
const { ioWrapper } = require('./websocket/middlewares/wrapper')
const authenticate = require('./websocket/middlewares/auth');
const { addClient, removeClient } = require('./websocket/clients');
const logger = require('./helpers/logger');

const initializeSocketEventHandlers = (socket) => {
    // Initialize socket event handlers
    // require('./websocket/event-handlers/chat.events')(io, socket);
}

const initializeSocketListeners = (socket) => {
    socket.on('message', ioWrapper(() => {
        socket.send({ error: 'An error occured' })
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
    initializeSocketEventHandlers(socket);
};

let curr_client;
const onConnection = async (socket) => {
    try {
        logger.info('sending message')
        // Authenticate socket
        const authenticated_socket = await authenticate(socket);

        if (authenticated_socket instanceof Error) {
            socket.emit('error', 'Authentication failed');
            socket.disconnect();

            throw new Error('Authentication failed');
        }

        socket = authenticated_socket; curr_client = socket;
        logger.info(`${socket.user.email}: connected`);

        // Register client
        addClient(curr_client);

        // Initialize socket listeners
        initializeSocketListeners(socket);
    } catch (error) {
        console.log(error.message)
        socket.send({
            error: 'An error occured'
        })
    }
};


const webServer = (app) => {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        }
    });

    io.on('connection', socketAsyncWrapper(onConnection));

    io.on('error', socketAsyncWrapper((error) => {
        logger.error(error);
        io.close();
    }));

    return httpServer
}

module.exports = webServer;
