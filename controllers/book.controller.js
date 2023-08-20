import bookServices from "../services/book.services.js";
import { borrowModel } from "../models/borrowing.model.js";
import moment from "moment";

class BookController {
  async create(req, res) {
    const data = {
      title: req.body.title,
      author: req.body.author,
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

    const bookExists = await bookServices.findById(data.bookId);
    if (!bookExists) {
        return res.status(400).send({
            success: false,
            message: " Book not found"
        })
    }

    const borrow = await borrowModel.create(data);
    return res.status(201).send({
      success: true,
      message: `The book has been borrowed by ${borrow.name}`
    });
  }
}
export default new BookController();
