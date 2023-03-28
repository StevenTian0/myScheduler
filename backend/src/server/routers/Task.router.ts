import { Router } from "express"
import {
	addController,
	updateController,
	deleteController,
	getController,
	getAllController,
	deleteAllController,
} from "../controllers/Task.controller"

const taskRouter = Router()

taskRouter.post("/api/task/create", addController)
taskRouter.patch("/api/task/update", updateController)
taskRouter.delete("/api/task/delete/:taskId", deleteController)
taskRouter.delete("/api/task/delete/:token", deleteAllController)
taskRouter.get("/api/task/getById/:taskId", getController)
taskRouter.get("/api/task/getAll/:token", getAllController)

export default taskRouter
