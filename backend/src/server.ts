import * as express from 'express';
import { Server as SocketServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { createClient } from 'redis';
import socket from './socket';

const app = express();
const server: HTTPServer = createServer(app);
const io: SocketServer = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

const client = createClient();
(async () => {
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
})();

app.get('/', (_, res) => {
  res.send('Server is running');
});

server.listen(8000, () => {
  console.log('listening on *:8000');

  socket({ io, client });
});
