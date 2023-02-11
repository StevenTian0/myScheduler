import mongoose, { Schema, Document } from "mongoose"

// Define the interface for the Blocker model

// Define the Mongoose schema for the Blocker document
const BlockerSchema: Schema = new Schema({
	time: { type: Date, required: true },
	duration: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	user: { type: mongoose.Types.ObjectId, ref: "User" },
})

// Export the Blocker model using Mongoose's model method
export default mongoose.model("Blocker", BlockerSchema)
