import Task from "../models/Task.model";

// create task, not sure if string?
export const add = async (
  dueDate: Date,
  lengthOfWork: number,
  name: string,
  description: string,
  user: string
) => {
    
    // Validate dueDate
    var now = new Date();
    if (dueDate<now) {
        throw new Error("Invalid due date");
    }

    //do we need to validate user? or is it getting checked automatically...
    
    // Create the new task
    const task = new Task({ dueDate, lengthOfWork, name, description, user});
    return task.save();
};