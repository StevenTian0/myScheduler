import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface IUpdateUserInput {
  userId: string;
  newUsername?: string;
  newPassword?: string;
  token: string;
}

export const updateUser = async ({
  userId,
  newUsername,
  newPassword,
  token,
}: IUpdateUserInput) => {
  try {
    // Verify the token to make sure the user is authenticated
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!decoded) {
      throw new Error("Invalid token");
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the new username is different from the old one
    if (newUsername && newUsername === user.username) {
      throw new Error("New username must be different from the old one");
    }

    // Check if the new password is different from the old one
    if (newPassword && (await bcrypt.compare(newPassword, user.password))) {
      throw new Error("New password must be different from the old one");
    }

    // Update the username if a new one was provided
    if (newUsername) {
      user.username = newUsername;
    }

    // Update the password if a new one was provided
    if (newPassword) {
      user.password = newPassword;
    }

    // Save the user to the database
    await user.save();

    return {
      message: "User updated successfully",
      user,
    };
  } catch (error) {
    throw error;
  }
};
