import bookServices from "../services/book.services.js";
import { borrowModel } from "../models/borrowing.model.js";
import moment from "moment";

class BookController {
  async create(req, res) {
    const data = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      availableCopies: req.body.availableCopies
    };
    for (const property in data) {
      if (!data[property]) {
        return res.status(400).send({
          success: false,
          message: `The ${property} field is required`
        });
      }
    }
    const book = await bookServices.create(data);
    return res.status(201).send({
      success: true,
      data: book
    });
  }
  async borrowBook(req, res) {
    const data = {
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      returnDate: moment(req.body.returnDate, "DD-MM-YYYY").toDate(),
      bookId: req.body.bookId
    };

    for (const property in data) {
      if (!data[property]) {
        return res.status(400).send({
          success: false,
          message: `The ${property} field is required`
        });
      }
    }
    const now = moment();
    const returnDate = moment(req.body.returnDate, "DD-MM-YYYY");
    if (returnDate.isBefore(now)) {
      return res.status(404).send({
        success: false,
        message: "Date has already passed"
      });
    }

    const bookExists = await bookServices.findById(data.bookId);
    if (!bookExists) {
      return res.status(400).send({
        success: false,
        message: " Book not found"
      });
    }
    if (bookExists.availableCopies < 1) {
      return res.status(400).send({
        success: false,
        message: "No more copies available"
      });
    }
    bookExists.availableCopies -= 1;
    await bookExists.save();

    const borrow = await borrowModel.create(data);
    return res.status(201).send({
      success: true,
      message: `The book has been borrowed by ${borrow.name}`
    });
  }

  async getBooks(req, res) {
    const data = {
      title: req.query.title,
      author: req.query.author,
      genre: req.query.genre
    };
    const books = await bookServices.getAllBooks(
      data.author,
      data.title,
      data.genre
    );
    if (books.length < 1) {
      return res.status(404).send({
        success: true,
        message: "No books found"
      });
    }
    return res.status(200).send({
      success: true,
      data: books
    });
  }

  async getAllBorrowedBooks(req, res) {
    const books = await bookServices.getAllBorrowedBooks();
    if (books.length < 1) {
      return res.status(404).send({
        success: true,
        message: "No books found"
      });
    }
    return res.status(200).send({
      success: true,
      data: books
    });
  }
}
export default new BookController();
