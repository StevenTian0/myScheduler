import { Router } from "express"
import { addBlockerController } from "../controllers/Blocker.controller"

const blockerRouter = Router()

blockerRouter.post("/api/blocker/add", addBlockerController)

export default blockerRouter
