import express from "express";
import userController from "../controllers/user.controller.js";
import store from "../config/multer.config.js";

const userRouter = express.Router();

userRouter.post("/signup", store.single('image'), userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers);


export default userRouter;
