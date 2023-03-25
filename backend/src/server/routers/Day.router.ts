import { Router } from "express"
import {
	addDayController,
	getAllDaysController,
} from "../controllers/Day.controller"

const dayRouter = Router()

dayRouter.post("/api/day/add", addDayController)
dayRouter.get("/api/day/getAllDays", getAllDaysController)

export default dayRouter