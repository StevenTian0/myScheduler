import jwt from "jsonwebtoken";
import User from "../models/User.model";
import { UiColor, LanguagePref } from "../models/User.model";
import bcrypt from "bcryptjs";

interface ILoginCredentials {
  username: string;
  password: string;
}

interface IUpdateUserInput {
  token: string;
  newUsername?: string;
  newPassword?: string;
  newUiColor?: UiColor;
  newLanguagePref?: LanguagePref;
}

// Sign Up Service
export const signUp = async (
  email: string,
  username: string,
  password: string
) => {
  // Validate email
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email address");
  }

  // Validate password
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
    throw new Error(
      "Password must be at least 7 characters long, contain one uppercase letter, one lowercase letter and one digit"
    );
  }

  // Check if email or username already exists in the database
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  }).exec();
  if (existingUser) {
    throw new Error("Email or username already exists");
  }

  // Create the new user
  const user = new User({ email, username, password });
  return user.save();
};

export async function deleteAccount(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user in the database using the decoded id from the token
    const user = await User.findById(decoded.userId);

    // If no user is found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Remove the user from the database
    await user.remove();

    return {
      message: `Account under email ${user.email} deleted successfully`,
    };
  } catch (error) {
    throw error;
  }
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

  console.log(process.env.JWT_SECRET);
  // If the username and password are both correct, return the user object and a JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user, token };
};

export const updateUser = async ({
  token,
  newUsername,
  newPassword,
  newUiColor,
  newLanguagePref,
}: IUpdateUserInput) => {
  try {
    // Verify the token to make sure the user is authenticated
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!decoded) {
      throw new Error("Invalid token");
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId);
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

    // Check if the new ui color is different from the old one
    if (newUiColor && newUiColor === user.uiColor) {
      throw new Error(
        "New ui color preference must be different from the old one"
      );
    }

    // Check if the new language preference is different from the old one
    if (newLanguagePref && newLanguagePref === user.languagePref) {
      throw new Error(
        "New language preference must be different from the old one"
      );
    }

    // Update the username if a new one was provided
    if (newUsername) {
      user.username = newUsername;
    }

    // Update the password if a new one was provided
    if (newPassword) {
      user.password = newPassword;
    }

    // Update the username if a new one was provided
    if (newUiColor) {
      user.uiColor = newUiColor;
    }

    // Update the password if a new one was provided
    if (newLanguagePref) {
      user.languagePref = newLanguagePref;
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
