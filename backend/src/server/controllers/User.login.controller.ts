import { Request, Response } from "express";
import { loginService } from "../services/User.login.service";

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const { user, token } = await loginService({ username, password });

    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
