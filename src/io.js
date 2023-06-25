const { createServer } = require('http');
const { Server } = require('socket.io');
const socketAsyncWrapper = require('./websocket/middlewares/wrapper').default
const authenticate = require('./websocket/middlewares/auth');
const { addClient, removeClient } = require('./websocket/clients');
const { initializeSocketEventHandlers } = require('./websocket/socket');
const logger = require('./helpers/logger');

let curr_client;
const onConnection = async (socket) => {
    try {
        // Authenticate socket connection
        const authenticated_socket = await authenticate(socket);

        if (authenticated_socket instanceof Error) {
            socket.emit('error', 'Authentication failed');
            socket.disconnect();
        }

        socket = authenticated_socket; curr_client = socket;
        logger.info(`${socket.user.email}: connected`);

        // Register client
        addClient(curr_client);

        // Initialize socket listeners
        initializeSocketEventHandlers(io, socket);
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
