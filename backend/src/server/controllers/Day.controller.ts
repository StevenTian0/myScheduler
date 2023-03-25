import { Request, Response } from "express"
import {
	addDay,
	getAllDays,
} from "../services/Day.service"

export const addDayController = async (req: Request, res: Response) => {
	try {
		const {
		    token,
            hoursWorked,
            workCompleted,
        } = req.body

		const day = await addDay(token, hoursWorked, workCompleted)
		res.status(201).json({ message: "Day added successfully", day })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}


export const getAllDaysController = async (req: Request, res: Response) => {
	try {
		const { token } = req.body
		const result = await getAllDays(token)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}