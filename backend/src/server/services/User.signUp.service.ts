import User from "../models/User";

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
