import { JsonDB, Config } from "node-json-db";
import {TaskModel} from "../model/TaskModel";
const db = new JsonDB(new Config("taskdb", true, false, "/"));
const db_file = "/tasks[]";

const createTask = async function (task: TaskModel): Promise<TaskModel> {
  await db.push(db_file, task, true);
  await db.save();
  return task;
};

const updateTask = async function (task: TaskModel): Promise<TaskModel> {
   const tasks: TaskModel[] = await db.getData("/tasks");
   await db.delete("/tasks");
   await db.push(
     "/tasks",
     tasks.map((p) =>{
      if(p.id == task.id)
        Object.assign(p,task);
      return p;
     }),
     true
   );
   await db.save();
  return task;
};

const removeTask = async function (taskId: number): Promise<void> {
  const tasks: TaskModel[] = await db.getData("/tasks");
  await db.delete("/tasks");
  await db.push(
    "/tasks",
    tasks.filter((p) => p.id !== taskId),
    true
  );
  await db.save();
 return;
};

const removeAll = async function (): Promise<void> {
  await db.delete("/tasks");
  await db.save();
 return;
};

const findAll = async function (): Promise<TaskModel[]> {
  var tasks:TaskModel[];
  try{
   tasks= await db.getData("/tasks");
  }catch(exception){
    return []
  }
  return tasks;
};
export { createTask,updateTask,removeTask,removeAll,findAll};
