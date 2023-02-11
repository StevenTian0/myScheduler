import { Router } from "express"
import {
	deleteUserAccount,
	signUpController,
	loginController,
	updateUserController,
	getUserScoreController,
	toggleColorUserController,
} from "../controllers/User.controller"

const userRouter = Router()

userRouter.post("/api/user/signUp", signUpController)
userRouter.delete("/api/user/delete", deleteUserAccount)
userRouter.post("/api/user/login", loginController)
userRouter.patch("/api/user/update", updateUserController)
userRouter.patch("/api/user/toggleColor", toggleColorUserController)
userRouter.get("/api/user/getScore", getUserScoreController)

export default userRouter
