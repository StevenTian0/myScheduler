import mongoose, { Schema, Document } from "mongoose"

// Define the DaySchema using Mongoose Schema
const DaySchema: Schema = new Schema({
	_id: { type: String, required: true }, // The objectId (dayId)
	hoursWorked: { type: [Number], default: [] }, // The list of hours of work completed is given by the tasks completed on the same day
	tasksWorked: {
		type: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
		default: [],
	}, // The list of tasks completed is a reference to the Task model
	user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // The user who worked on the tasks of the day is a reference to the User model and is required
})

export default mongoose.model("Day", DaySchema)
