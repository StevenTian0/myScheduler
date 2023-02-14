import { Request, Response } from "express"
import {
	addTask,
	updateTask,
	deleteTask,
	getTask,
	getAllTasks,
} from "../services/Task.service"

export const addController = async (req: Request, res: Response) => {
	try {
		const {
			_id,
			dueDate,
			lengthOfWork,
			priorityValue,
			token,
			categoryValue,
			name,
			description,
		} = req.body

		const task = await addTask(
			_id,
			dueDate,
			lengthOfWork,
			priorityValue,
			token,
			categoryValue,
			name,
			description
		)

		res.status(201).json({ message: "Task created successfully", task })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateController = async (req: Request, res: Response) => {
	try {
		const {
			_id,
			token,
			newDueDate,
			newLengthOfWork,
			newName,
			newDescription,
			workDone,
		} = req.body

		const task = await updateTask({
			_id,
			token,
			newDueDate,
			newLengthOfWork,
			newName,
			newDescription,
			workDone,
		})

		res.status(201).json({ message: "Task updated successfully", task })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteController = async (req: Request, res: Response) => {
	try {
		const { _id } = req.body
		const result = await deleteTask(_id)

		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getController = async (req: Request, res: Response) => {
	try {
		const { _id } = req.body

		const task = await getTask(_id)

		res.status(200).json(task)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getAllController = async (req: Request, res: Response) => {
	try {
		const { token } = req.body
		const tasks = await getAllTasks(token)

		res.status(200).json(tasks)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
