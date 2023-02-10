import { Router } from "express";
import { updateUserController } from "../controllers/User.update.controller";

const router = Router();

router.patch("/api/user/update", updateUserController);

export default router;
