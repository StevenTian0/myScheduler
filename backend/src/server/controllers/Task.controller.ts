import { Request, Response } from "express";
import {
  add, updateTask, deleteTask, getTask, getAllTasks,
} from "../services/Task.service";

export const addController = async (req: Request, res: Response) => {
  try {

    const dueDate = new Date(req.body.dueDate);
    const lengthOfWork = Number(req.body.lengthOfWork);
    const {name, description, user} = req.body;

    const task = await add(dueDate, lengthOfWork, name, description, user);

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateController = async (req: Request, res: Response) => {
    try {
        const {taskId, newDueDate, newLengthOfWork, newName, newDescription, workDone,} = req.body;
  
        const task = await updateTask({
            taskId,
            newDueDate,
            newLengthOfWork,
            newName,
            newDescription,
            workDone});
    
        res.status(201).json({ message: "Task updated successfully", task });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

 export const deleteController = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.body;
        const result = await deleteTask(taskId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
 };

export const getController = async (req: Request, res: Response) => {
  try {

    const { taskId } = req.body;

    const task = await getTask(taskId);

    res.status(200).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllController = async (req: Request, res: Response) => {
  try {

    const tasks = await getAllTasks();

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



