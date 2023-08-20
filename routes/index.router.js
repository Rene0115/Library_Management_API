import userRouter from "./user.router.js";
import bookRouter from "./book.router.js";
import express from "express"

const router = express.Router();

router.use("/user", userRouter);
router.use("/book", bookRouter);

export default router;