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

        // for each task in the list
        for(const task of allTasks){
        // for each hours worked for each task
            for(const hoursPerTask of workCompleted){
                // if lengthOfWork == hoursPerTask we can assume the task has been completed?
                const completedTasks = await Task.find((taskObj) => {
                    return taskObj.lengthOfWork === hoursPerTask
                });
                    // i'm not sure this only finds tasks that have been completed
                }
                task.workDoneSoFar = hoursPerTask
                // otherwise we assign the hours spent to workDoneSoFar
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
// 		if (!user) {
// 			throw new Error("User not found")
// 		}

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

