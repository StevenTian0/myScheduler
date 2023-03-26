import { Request, Response } from "express"
import {
	createDay,
	createEmptyDay,
	deleteDay,
	getDayById,
	updateDay,
} from "../services/Day.service"

export const createDayController = async (req: Request, res: Response) => {
	try {
		const { _id, hoursWorked, tasksWorked, user } = req.body
		const newDay = await createDay({ _id, hoursWorked, tasksWorked, user })
		res.status(201).json({ message: "Day created successfully", newDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const createEmptyDayController = async (req: Request, res: Response) => {
	try {
		const { _id, user } = req.body
		const newDay = await createEmptyDay(_id, user)
		res.status(201).json({ message: "Empty day created successfully", newDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getDayByIdController = async (req: Request, res: Response) => {
	try {
		const { dayId } = req.body
		const day = await getDayById(dayId)
		res.status(200).json({ day })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateDayController = async (req: Request, res: Response) => {
	try {
		const { _id, hoursWorked, tasksWorked, user } = req.body
		const dayUpdates = { _id, hoursWorked, tasksWorked, user }
		const updatedDay = await updateDay(dayUpdates)
		res.status(200).json({ message: "Day updated successfully", updatedDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteDayController = async (req: Request, res: Response) => {
	try {
		const { dayId } = req.body
		const deletedDay = await deleteDay(dayId)
		res.status(200).json({ message: "Day deleted successfully", deletedDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
