const { Server } = require('socket.io');

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow connections from frontend
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    // Join personal user room for direct notifications
    socket.on('joinUser', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join specific thesis room
    socket.on('joinThesis', (thesisId) => {
      if (thesisId) {
        socket.join(`thesis:${thesisId}`);
      }
    });

    // Leave thesis room
    socket.on('leaveThesis', (thesisId) => {
      if (thesisId) {
        socket.leave(`thesis:${thesisId}`);
      }
    });

    // Join submission comments room
    socket.on('joinSubmission', (submissionId) => {
      if (submissionId) {
        socket.join(`submission:${submissionId}`);
      }
    });

    // Leave submission comments room
    socket.on('leaveSubmission', (submissionId) => {
      if (submissionId) {
        socket.leave(`submission:${submissionId}`);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}

function getIO() {
  return io;
}

function notifyUser(userId, event, payload) {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, payload);
  }
}

function notifyThesis(thesisId, event, payload) {
  if (io && thesisId) {
    io.to(`thesis:${thesisId}`).emit(event, payload);
  }
}

function notifySubmission(submissionId, event, payload) {
  if (io && submissionId) {
    io.to(`submission:${submissionId}`).emit(event, payload);
  }
}

function notifyAll(event, payload) {
  if (io) {
    io.emit(event, payload);
  }
}

module.exports = {
  initSocket,
  getIO,
  notifyUser,
  notifyThesis,
  notifySubmission,
  notifyAll,
};
