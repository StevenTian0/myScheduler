import { Router } from "express";
import { loginController } from "../controllers/User.login.controller";

const router = Router();

router.post("/api/user/login", loginController);

export default router;