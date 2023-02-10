import { Request, Response } from "express";
import updateUser from "../services/User.update";

const updateUserController = async (req: Request, res: Response) => {
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

export default updateUserController;
