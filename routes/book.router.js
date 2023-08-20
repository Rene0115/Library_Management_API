import bookController from "../controllers/book.controller.js";
import express from "express";
import authentication from "../middleware/auth.middlewares.js";

const bookRouter = express.Router();
bookRouter.post("/create", authentication, bookController.create);
bookRouter.post("/borrow", authentication, bookController.borrowBook);
bookRouter.get("/", authentication ,bookController.getBooks);
bookRouter.get("/borrowed", authentication, bookController.getAllBorrowedBooks)
export default bookRouter;
