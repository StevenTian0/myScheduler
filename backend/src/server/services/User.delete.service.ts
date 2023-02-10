import jwt from "jsonwebtoken";
import User from "../models/User";

export async function deleteAccount(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database using the decoded id from the token
    const user = await User.findById(decoded._id);

    // If no user is found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Remove the user from the database
    await user.remove();

    return {
      message: "User account deleted successfully",
    };
  } catch (error) {
    throw error;
  }
}
