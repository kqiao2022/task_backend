import express from "express";
import * as TaskManager from "../service/TaskManager";
const router = express.Router();

router.post("/create", async function (req, res) {
   const task=  req.body;
   await TaskManager.createTask(task);
   const event = {name:"taskCreated",task}
   const wss =req.app.locals.socketServer;
   wss.clients.forEach((ws: WebSocket) => {
     ws.send(JSON.stringify(event))
   });
   res.send({ok:true})
});

router.put("/update", async function (req, res) {
  const task=  req.body;
  await TaskManager.updateTask(task);
  const event = {name:"taskUpdated",task}
  const wss =req.app.locals.socketServer;
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(event))
  });
  res.send({ok:true})
});

router.get("/list", async function (req, res) {
  const tasks =  await TaskManager.findAll();
  res.send({ok:true,message:tasks})
});

router.delete("/remove/:taskId", async function (req, res) {
  const taskId =  req.params.taskId;
  await TaskManager.removeTask(Number(taskId));
  const event = {name:"taskRemoved",taskId:Number(taskId)}
  const wss =req.app.locals.socketServer;
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(event))
  });
  res.send({ok:true})
});

router.delete("/all", async function (req, res) {
  await TaskManager.removeAll();
  const event = {name:"allRemoved"}
  const wss =req.app.locals.socketServer;
  wss.clients.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(event))
  });
  res.send({ok:true})
});
export default router;
