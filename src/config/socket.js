module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Sockets now connected...', socket.id);
  });
};
