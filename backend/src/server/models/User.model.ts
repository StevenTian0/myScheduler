import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  // languagePref: LanguagePref;
  // uiColor: UiColor;
  score: number;
}

// // Define the UI color enum type
// enum UiColor {
//   LIGHT = "light",
//   DARK = "dark",
// }

// // Define the language preference enum type
// enum LanguagePref {
//   EN = "EN",
//   FR = "FR",
// }

// Define the Mongoose schema for the User document
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, // email is a required string field and must be unique
  username: { type: String, required: true, unique: true }, // username is a required string field and must be unique
  password: { type: String, required: true }, // password is a required string field
  // languagePref: { type: LanguagePref, default: LanguagePref.EN }, // languagePref is an optional field, defaulting to EN
  // uiColor: { type: UiColor, default: UiColor.LIGHT }, // uiColor is an optional field, defaulting to LIGHT
  score: { type: Number, default: 0 }, // score is an optional number field, defaulting to 0
});

UserSchema.pre("save", async function (next) {
  const rounds = 10; // What you want number for round paasword

  const hash = await bcrypt.hash(this.password, rounds);
  this.password = hash;
  next();
});

// Compile the User model from the UserSchema and export it
export default mongoose.model<IUser>("User", UserSchema);
