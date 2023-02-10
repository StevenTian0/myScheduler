import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Day model
export interface IDay extends Document {
  hoursWorked: number;
  workCompleted: Array<number>;
  taskCompleted: Array<mongoose.Types.ObjectId>;
  user: string;
}

// Define the DaySchema using Mongoose Schema
const DaySchema: Schema = new Schema({
  hoursWorked: { type: Number, default: 0 }, // The length of work in total defaults to 0
  workCompleted: [{ type: Number }], // The list of hours of work completed is given by the tasks completed on the same day
  taskCompleted: [{ type: mongoose.Types.ObjectId, ref: "Task" }], // The list of tasks completed is a reference to the Task model
  user: { type: mongoose.Types.ObjectId, ref: "User" }, // The user who worked on the tasks of the day is a reference to the User model
});

export default mongoose.model<IDay>("Day", DaySchema);
