var socketHelper = function (io) {
  console.log("socket.io Initialized ...")
  // require methods
  const socketFunc = require('../helpers/helping.helper')
  // on connect
  io.on('connection', function (socket) {
    socketFunc.connectionFunction(socket);
    // on disconnect
    socket.on('disconnect', function () {
      socketFunc.disconnectFunction(socket);
    });
  });
};

module.exports = {
  socketHelper
};