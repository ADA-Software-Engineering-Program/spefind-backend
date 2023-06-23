const { createServer } = require('http');
const { Server } = require('socket.io');
const { randomUUID } = require('crypto');

const socketWrapper = require('./websocket/middlewares/wrapper');
const authenticate = require('./websocket/middlewares/auth');
const { addClient, removeClient } = require('./websocket/clients');
const app = require("./app");

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

// Create http server with express app
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.use(socketWrapper((socket, next) => {
    const { origin } = socket.handshake.headers;

    const allowed_origins = ['http://localhost:3000', 'http://localhost:3001'];

    if (allowed_origins.includes(origin)) next();
    else next(new Error('Not allowed by CORS'));
}));

io.on('connection', socketWrapper(onConnection));

io.on('error', socketWrapper((error) => {
    console.log(error);
    io.close();
}));

module.exports = httpServer;
