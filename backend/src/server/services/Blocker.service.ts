// Service to add a blocker with time conflict check
import { fetchUser } from "./User.service"
import Blocker from "../models/Blocker.model"
export const addBlocker = async (
	token: string,
	time: Date,
	duration: number,
	name?: string,
	description?: string
) => {
	try {
		time = new Date(time)
		const user = await fetchUser(token)
		const existingBlockers = await Blocker.find({ user: user._id })
		for (const existingBlocker of existingBlockers) {
			const start = existingBlocker.time
			const end = new Date(
				start.getTime() + existingBlocker.duration * 60 * 1000
			)
			if (time >= start && time <= end) {
				throw new Error(
					"Conflict with existing blocker, please choose a different time."
				)
			}
			if (
				new Date(time.getTime() + duration * 60 * 1000) >= start &&
				new Date(time.getTime() + duration * 60 * 1000) <= end
			) {
				throw new Error(
					"Conflict with existing blocker, please choose a different time."
				)
			}
		}

		if (duration <= 0) {
			throw new Error("The duration has to be postive.")
		}

		const newBlocker = new Blocker({
			time,
			duration,
			name: name || "new Blocker",
			description: description || "new Description",
			user: user._id,
		})
		await newBlocker.save()
		return newBlocker
	} catch (error) {
		throw error
	}
}

export const deleteBlocker = async (token: string, time: Date) => {
	try {
		const user = await fetchUser(token)
		const blocker = await Blocker.findOne({ user: user._id, time: time })
		if (!blocker) {
			throw new Error("Blocker not found")
		}
		await blocker.remove()
		return { message: "Blocker deleted successfully" }
	} catch (error) {
		throw error
	}
}
