import { Router } from "express";
import {
  deleteUserAccount,
  signUpController,
  loginController,
  updateUserController,
} from "../controllers/User.controller";

const userRouter = Router();

userRouter.post("/api/user/signUp", signUpController);
// userRouter.delete("/api/user/delete", deleteUserAccount);
// userRouter.post("/api/user/login", loginController);
// userRouter.patch("/api/user/update", updateUserController);

export default userRouter;
