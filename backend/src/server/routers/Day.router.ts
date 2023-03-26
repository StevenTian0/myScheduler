import { Router } from "express"
import {
	createDayController,
	createEmptyDayController,
	deleteDayController,
	getDayByIdController,
	updateDayController,
	getTotalHoursWorkedController,
} from "../controllers/Day.controller"

const dayRouter = Router()

dayRouter.post("/api/day/create", createDayController)
dayRouter.post("/api/day/createEmpty", createEmptyDayController)
dayRouter.get("/api/day/getById", getDayByIdController)
dayRouter.get("/api/day/getTotalHours", getTotalHoursWorkedController)
dayRouter.patch("/api/day/update", updateDayController)
dayRouter.delete("/api/day/delete", deleteDayController)

export default dayRouter
