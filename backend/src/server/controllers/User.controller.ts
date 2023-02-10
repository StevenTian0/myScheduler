import { Request, Response } from "express";
import {
  deleteAccount,
  loginService,
  signUp,
  updateUser,
} from "../services/User.service";

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await deleteAccount(token);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await loginService({ username, password });

    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const user = await signUp(email, username, password);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { userId, newUsername, newPassword, token } = req.body;
    const result = await updateUser({
      userId,
      newUsername,
      newPassword,
      token,
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
