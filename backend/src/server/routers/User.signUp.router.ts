import { Router } from "express";
import { signUpController } from "../controllers/User.signUp.controller";

const router = Router();

router.post("/api/user/SignUp", signUpController);

export default router;