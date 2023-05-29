module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('sockets now connected...', socket.id);
  });
};
