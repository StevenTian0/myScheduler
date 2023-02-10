import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Task model
export interface ITask extends Document {
  priority: Priority;
  dueDate: Date;
  lengthOfWork: number;
  workDoneSoFar: number;
  name: string;
  description: string;
  category: Category;
  user: string;
}

// Define the priority of the task as an enum
enum Priority {
  URG = 0,
  HIG = 1,
  MED = 2,
  LOW = 3,
}

// Define the category of the task as an enum
enum Category {
  NA = "Unassigned",
  ASS = "Assignment",
  HOB = "Hobby",
  REL = "Relaxing",
  EXE = "Exercises",
}

// Define the TaskSchema using Mongoose Schema
const TaskSchema: Schema = new Schema({
  priority: { type: Priority, required: true }, // The priority of the task is required
  dueDate: { type: Date, required: true }, // The due date of the task is required
  lengthOfWork: { type: Number, required: true }, // The length of work is required
  workDoneSoFar: { type: Number, default: 0 }, // The amount of work done so far is optional and defaults to 0
  name: { type: String, required: true }, // The name of the task is required
  description: { type: String }, // The description of the task is optional
  category: { type: Category, default: Category.NA }, // The category of the task is optional and defaults to 'Unassigned'
  user: { type: mongoose.Types.ObjectId, ref: "User" }, // The user who created the task is a reference to the User model
});

// Export the Task model using Mongoose's model method
export default mongoose.model<ITask>("Task", TaskSchema);
