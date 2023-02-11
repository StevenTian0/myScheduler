// Controller to handle the request to add a blocker with time conflict check
import { Request, Response } from "express"
import { addBlocker, deleteBlocker } from "../services/Blocker.service"

export const addBlockerController = async (req: Request, res: Response) => {
	try {
		const { token, time, duration, name, description } = req.body
		const blocker = await addBlocker(token, time, duration, name, description)
		res.status(201).json({ message: "Blocker added successfully", blocker })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteBlockerController = async (req: Request, res: Response) => {
	try {
		const { token, time } = req.body
		const result = await deleteBlocker(token, new Date(time))
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
