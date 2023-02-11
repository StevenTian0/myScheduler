import { Router } from "express";
import {
  addController,
  updateController,
} from "../controllers/Task.controller";

const taskRouter = Router();

taskRouter.post("/api/task/add", addController);
taskRouter.patch("/api/task/update", updateController);

export default taskRouter;