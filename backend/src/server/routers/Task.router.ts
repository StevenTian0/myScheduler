import { Router } from "express";
import {
  addController,
} from "../controllers/Task.controller";

const taskRouter = Router();

taskRouter.post("/api/task/add", addController);

export default taskRouter;