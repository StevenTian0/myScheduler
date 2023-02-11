// Controller to handle the request to add a blocker with time conflict check
import { Request, Response } from "express"
import { addBlocker } from "../services/Blocker.service"

export const addBlockerController = async (req: Request, res: Response) => {
	try {
		const { token, time, duration, name, description } = req.body
		const blocker = await addBlocker(token, time, duration, name, description)
		res.status(201).json({ message: "Blocker added successfully", blocker })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
