require('dotenv').config();
const http = require('http');
const { createApp } = require('./app');
const { initSocket } = require('./lib/socket');

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();
const server = http.createServer(app);

// Initialize Socket.io real-time engine
initSocket(server);

server.listen(PORT, () => {
  console.log(`ThesisFlow Real-Time API listening on http://localhost:${PORT}`);
});
