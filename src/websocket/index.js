const { createServer } = require('http');
const { Server } = require('socket.io');
const socketAsyncWrapper = require('./middlewares/wrapper').default
const authenticate = require('./middlewares/auth');
const { addClient, removeClient } = require('./clients');
const { initializeSocketEventHandlers } = require('./socket');
const logger = require('../helpers/logger');
const fs = require('fs')

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
    logger.info('logging')
    const deployed = process.env.DEPLOYED | true
    let options = {
        cors: {
            origin: 'http://localhost:3000',
        }
    }

    options = deployed
        ? Object.assign(options, {
            key: fs.readFileSync(__dirname + '\\server.key', 'utf-8'),
            cert: fs.readFileSync(__dirname + '\\server.cert', 'utf-8')
        })
        : options

    const httpServer = createServer(app);
    const io = new Server(httpServer, options);

    io.on('connection', socketAsyncWrapper(onConnection));

    io.on('error', socketAsyncWrapper((error) => {
        logger.error(error);
        io.close();
    }));

    global.io = io;

    return httpServer
}

module.exports = webServer;
