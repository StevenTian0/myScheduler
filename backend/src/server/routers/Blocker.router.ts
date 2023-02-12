import { Router } from "express"
import {
	addBlockerController,
	deleteBlockerController,
	getAllBlockersController,
	updateBlockerTimeController,
	updateBlockerDurationController,
} from "../controllers/Blocker.controller"

const blockerRouter = Router()

blockerRouter.post("/api/blocker/add", addBlockerController)
blockerRouter.delete("/api/blocker/delete", deleteBlockerController)
blockerRouter.get("/api/blockers/getAll", getAllBlockersController)
blockerRouter.patch("/api/blockers/updateTime", updateBlockerTimeController)
blockerRouter.patch(
	"/api/blockers/updateDuration",
	updateBlockerDurationController
)

export default blockerRouter
