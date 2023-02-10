import { Request, Response } from "express";
import { signUp } from "../services/User.signUp.service";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const user = await signUp(email, username, password);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
