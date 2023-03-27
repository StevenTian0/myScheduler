import { Router } from "express"
import {
	addBlockerController,
	deleteBlockerController,
	getAllBlockersController,
	updateBlockerTimeController,
	updateBlockerDurationController,
	updateBlockerNameAndDescriptionController,
	updateBlockerTaskController,
	getByTimeController,
	getTaskIdController,
	getBetweenTimesController,
} from "../controllers/Blocker.controller"

const blockerRouter = Router()

blockerRouter.post("/api/blocker/add", addBlockerController)
blockerRouter.delete(
	"/api/blocker/delete/:token/:time",
	deleteBlockerController
)
blockerRouter.get("/api/blockers/getAll/:token", getAllBlockersController)
blockerRouter.patch("/api/blockers/updateTime", updateBlockerTimeController)
blockerRouter.patch(
	"/api/blockers/updateDuration",
	updateBlockerDurationController
)
blockerRouter.patch(
	"/api/blockers/updateNameAndDescription",
	updateBlockerNameAndDescriptionController
)
blockerRouter.patch("/api/blockers/updateTask", updateBlockerTaskController)
blockerRouter.get("/api/blockers/getByTime/:token/:time", getByTimeController)
blockerRouter.get("/api/blockers/getTaskId/:token/:time", getTaskIdController)
blockerRouter.get(
	"/api/blockers/getBetweenTimes/:token/:startTime/:endTime",
	getBetweenTimesController
)

export default blockerRouter
