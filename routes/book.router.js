import bookController from "../controllers/book.controller.js";
import express from "express";
import authentication from "../middleware/auth.middlewares.js";
import store from "../config/multer.config.js";

const bookRouter = express.Router();
bookRouter.post("/create", store.single("image"),authentication, bookController.create);
bookRouter.post("/borrow", authentication, bookController.borrowBook);
bookRouter.get("/", authentication ,bookController.getBooks);
bookRouter.get("/borrowed", authentication, bookController.getBorrowedBooks);
bookRouter.post("/return", authentication, bookController.returnBook);
export default bookRouter;
