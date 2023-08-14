import express from 'express';
import userController from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', userController.signup);

export default userRouter
