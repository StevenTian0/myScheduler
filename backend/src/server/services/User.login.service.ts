import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface ILoginCredentials {
  username: string;
  password: string;
}

export const loginService = async (credentials: ILoginCredentials) => {
  const { username, password } = credentials;

  // Find the user with the given username
  const user = await User.findOne({ username });

  // If no user is found, return an error
  if (!user) {
    throw new Error("Username not found");
  }

  // Compare the provided password with the hashed password stored in the database
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // If the password is incorrect, return an error
  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  // If the username and password are both correct, return the user object and a JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user, token };
};
