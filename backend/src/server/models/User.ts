import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  languagePref: LanguagePref;
  uiColor: UiColor;
  score: number;
}

// Define the UI color enum type
enum UiColor {
  LIGHT = "light",
  DARK = "dark",
}

// Define the language preference enum type
enum LanguagePref {
  EN = "EN",
  FR = "FR",
}

// Define the Mongoose schema for the User document
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, // email is a required string field and must be unique
  username: { type: String, required: true, unique: true }, // username is a required string field and must be unique
  password: { type: String, required: true }, // password is a required string field
  languagePref: { type: LanguagePref, default: LanguagePref.EN }, // languagePref is an optional field, defaulting to EN
  uiColor: { type: UiColor, default: UiColor.LIGHT }, // uiColor is an optional field, defaulting to LIGHT
  score: { type: Number, default: 0 }, // score is an optional number field, defaulting to 0
});

// Compile the User model from the UserSchema and export it
export default mongoose.model<IUser>("User", UserSchema);

// Hash the password before saving the user to the database
UserSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // Hash the password using the salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // Overwrite the plain text password with the hashed password
      user.password = hash;
      next();
    });
  });
});
