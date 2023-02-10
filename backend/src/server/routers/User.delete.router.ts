import { Router } from "express";
import { deleteUserAccount } from "../controllers/User.delete.controller";

const router = Router();

router.delete("/api/user/delete", deleteUserAccount);

export default router;