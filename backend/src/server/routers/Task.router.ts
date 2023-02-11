import { Router } from "express";
import {
  addController,
  updateController,
  deleteController,
  getController,
} from "../controllers/Task.controller";

const taskRouter = Router();

taskRouter.post("/api/task/add", addController);
taskRouter.patch("/api/task/update", updateController);
taskRouter.delete("/api/task/delete", deleteController);
taskRouter.get("/api/task/get", getController);

export default taskRouter;