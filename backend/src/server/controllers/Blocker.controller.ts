// Controller to handle the request to add a blocker with time conflict check
import { Request, Response } from "express"
import {
	addBlocker,
	deleteBlocker,
	getAllBlockers,
	updateBlockerDuration,
	updateBlockerTime,
} from "../services/Blocker.service"

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

export const getAllBlockersController = async (req: Request, res: Response) => {
	try {
		const { token } = req.body
		const result = await getAllBlockers(token)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateBlockerTimeController = async (
	req: Request,
	res: Response
) => {
	try {
		const { token, oldTime, newTime } = req.body
		const result = await updateBlockerTime(
			token,
			new Date(oldTime),
			new Date(newTime)
		)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateBlockerDurationController = async (
	req: Request,
	res: Response
) => {
	try {
		const { token, time, newDuration } = req.body
		const result = await updateBlockerDuration(
			token,
			new Date(time),
			newDuration
		)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
