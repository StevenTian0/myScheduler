import Day from "../models/Day.model"
import { fetchUser } from "./User.service"
import { getAllTasks } from "./Task.service"

export const addDay = async (
	token: string,
	hoursWorked: number,
	workCompleted: number[]
) => {
	try {

		const user = await fetchUser(token)

        const allTasks = await Task.find({ user: user._id })

        if (!tasks) {
            throw new Error("Tasks not found")
        }

        for(const task of allTasks){
            // if timeNeededToCompleteTask == completedTime we can assume the task has been completed?
            const timeNeededToCompleteTask = task.lengthOfWork
            const completedTime = task.workDoneSoFar
            if(timeNeededToCompleteTask == completedTime){
                const completedTasks = await Task.find({ user: user._id })
                // i'm not sure this only finds tasks that have been completed
            }
            else{
                throw new Error("There are no completed tasks yet!")
            }
        }

		const newDay = new Day({
			hoursWorked,
			workCompleted,
			completedTasks,
			user: user._id,
		})
		await newDay.save()
		return newDay
	} catch (error) {
		throw error
	}
}


export async function getAllDays(token: string) {
	try {
		const user = await fetchUser(token)
		if (!user) {
			throw new Error("User not found")
		}

		const days = await Day.find({ user: user._id })

        if (!days) {
                throw new Error("Days not found")
        }

		return {
			message: "Days retrieved successfully",
			days,
		}
	} catch (error) {
		throw error
	}
}

