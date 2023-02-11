import { Router } from "express"
import {
	addBlockerController,
	deleteBlockerController,
} from "../controllers/Blocker.controller"

const blockerRouter = Router()

blockerRouter.post("/api/blocker/add", addBlockerController)
blockerRouter.delete("/api/blocker/delete", deleteBlockerController)

export default blockerRouter
