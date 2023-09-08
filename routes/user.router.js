import express from "express";
import userController from "../controllers/user.controller.js";
import store from "../config/multer.config.js";
import authentication from "../middleware/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/signup", store.single("image"), userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers);
userRouter.get("/id", authentication, userController.findById);

export default userRouter;
