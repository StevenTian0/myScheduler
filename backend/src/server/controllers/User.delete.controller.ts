import { Request, Response } from "express";
import { deleteAccount } from "../services/User.delete.service";

export async function deleteUserAccount(req: Request, res: Response) {
  try {
    const { token } = req.body;

    const result = await deleteAccount(token);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}