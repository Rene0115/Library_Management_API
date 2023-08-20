import express from "express";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers);

export default userRouter;
