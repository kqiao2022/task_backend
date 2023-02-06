import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import cors from 'cors';
import taskRouter from './routes/task';
const app = express();
interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  }),
);
app.use(express.json());
app.use('/task', taskRouter);

//initialize the WebSocket server instance
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.locals.socketServer = wss;
wss.on('connection', (ws) => {

  const extWs = ws as ExtWebSocket;
  extWs.isAlive = true;
  ws.on('pong', () => {
      extWs.isAlive = true;
  });

});

setInterval(() => {

  wss.clients.forEach((ws) => {
      const extWs = ws as ExtWebSocket;
      if (!extWs.isAlive) return ws.terminate();
      extWs.isAlive = false;
      ws.ping(null, undefined);
  });

}, 10000);
server.listen(8080, () => {
  console.log('Task service started on port 8080');
});
