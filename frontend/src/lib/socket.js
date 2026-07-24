import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    const SOCKET_URL =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : window.location.origin;

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
    });
  }
  return socket;
}

export function joinUserRoom(userId) {
  const s = getSocket();
  if (userId) {
    s.emit('joinUser', userId);
  }
}

export function joinThesisRoom(thesisId) {
  const s = getSocket();
  if (thesisId) {
    s.emit('joinThesis', thesisId);
  }
}

export function leaveThesisRoom(thesisId) {
  const s = getSocket();
  if (thesisId) {
    s.emit('leaveThesis', thesisId);
  }
}

export function joinSubmissionRoom(submissionId) {
  const s = getSocket();
  if (submissionId) {
    s.emit('joinSubmission', submissionId);
  }
}

export function leaveSubmissionRoom(submissionId) {
  const s = getSocket();
  if (submissionId) {
    s.emit('leaveSubmission', submissionId);
  }
}
