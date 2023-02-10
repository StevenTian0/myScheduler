import { Request, Response } from "express";
import { deleteAccount } from "../services/User.delete.service";

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await deleteAccount(token);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
