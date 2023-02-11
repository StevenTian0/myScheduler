import { Request, Response } from "express";
import {
  add,
} from "../services/Task.service";

export const addController = async (req: Request, res: Response) => {
  try {

    const dueDate = new Date(req.body.dueDate);
    const lengthOfWork = Number(req.body.lengthOfWork);
    const {name, description, user} = req.body;
    console.log(dueDate);
    console.log(lengthOfWork);

    const task = await add(dueDate, lengthOfWork, name, description, user);

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};