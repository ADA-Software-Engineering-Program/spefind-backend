const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors')
const socketWrapper = require('./websocket/middlewares/wrapper');
const authenticate = require('./websocket/middlewares/auth');
const { addClient, removeClient } = require('./websocket/clients');
const logger = require('./helpers/logger');

const initializeSocketEventHandlers = (socket) => {
    // Initialize socket event handlers
    // require('./websocket/event-handlers/chat.events')(io, socket);
}

const initializeSocketListeners = (socket) => {
    try {
        // Initialize socket listeners
        socket.on('message', (message) => {
            console.log(message);
        });

        socket.on('disconnect', () => {
            console.log(socket.user.email + ': disconnected');

            // Remove client from clients map
            removeClient(socket);
        });

        socket.on('error', (error) => {
            // Send error to client
            console.log(error);

            // Close connection
            socket.disconnect();
        });

        // Initialize socket event handlers
        initializeSocketEventHandlers(socket);
    } catch (error) {
        console.log(error);
    }
};

let curr_client;
const onConnection = async (socket) => {
    logger.info('sending message')
    socket.send('dfadf')
    // Authenticate socket
    const authenticated_socket = await authenticate(socket);

    if (authenticated_socket instanceof Error) {
        socket.emit('error', 'Authentication failed');
        socket.disconnect();

        throw new Error('Authentication failed');
    }

    socket = authenticated_socket; curr_client = socket;
    console.log(`${socket.user.email}: connected`);

    // Register client
    addClient(curr_client);

    // Initialize socket listeners
    initializeSocketListeners(socket);
};


const webServer = (app) => {
    // Create http server with express app
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        }
    });

    io.on('connection', socketWrapper(onConnection));

    io.on('error', socketWrapper((error) => {
        logger.error(error);
        io.close();
    }));

    return httpServer
}

module.exports = webServer;
