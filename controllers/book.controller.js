import bookServices from "../services/book.services.js";
import { borrowerModel } from "../models/borrowing.model.js";
import { uploadImage } from "../config/cloudinary.config.js";
import moment from "moment";

class BookController {
  async create(req, res) {
    if (!("file" in req)) {
      return res.status(400).send({
        success: false,
        message: "Must add image to create book"
      });
    }
    const image = await uploadImage(req.file.path);
    const data = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      availableCopies: req.body.availableCopies,
      image: image.secure_url,
      library: req.user.libraryName
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
      book: [
        {
          id: req.body.bookId
        }
      ]
    };

    const properties = bookServices.checkForEmptyProperty(data);
    if (properties !== true) {
      const undefinedText = undefinedProperties.join(" ");
      return res.status(400).send({
        success: false,
        message: `Undefined properties: ${undefinedText} do not exist.`
      });
    }
    const now = moment();
    const returnDate = moment(req.body.returnDate, "DD-MM-YYYY");
    if (returnDate.isBefore(now)) {
      return res.status(404).send({
        success: false,
        message: "Date has already passed"
      });
    }

    const bookExists = await bookServices.findById(req.body.bookId);
    if (!bookExists) {
      return res.status(400).send({
        success: false,
        message: "Book not found"
      });
    }
    if (bookExists.availableCopies < 1) {
      return res.status(400).send({
        success: false,
        message: "No more copies available"
      });
    }

    const borrowerExists = await borrowerModel.findOne({ email: data.email });
    if (borrowerExists) {
      const idExists = borrowerExists.books.find(
        (ids) => ids.id == req.body.bookId
      );
     
      if (idExists !== undefined) {
        
        return res.status(400).send({
          success: false,
          message: "You cant borrow a book more than once"
        });
      }
      bookExists.availableCopies -= 1;
      await bookExists.save();
      borrowerExists.books.push({ id: req.body.bookId });
      await borrowerExists.save();
      return res.status(200).send({
        success: true,
        data: borrowerExists
      });
    }
    const borrow = await borrowerModel.create(data);
    return res.status(201).send({
      success: true,
      message: `The book has been borrowed by ${borrow.name}`
    });
  }
  async returnBook(req, res) {
    const data = {
      email: req.body.email.toLowerCase(),
      id: req.body.id
    }
    for (const property in data) {
      if (!data[property]) {
        return res.status(400).send({
          success: false,
          message: `The ${property} field is required`
        });
      }
    }

    const borrower = await borrowerModel.findOne({email: data.email});
    const bookId = data.id
    const books = borrower.books
    const itemIndex = books.findIndex(item=> item.id == bookId)
    books.splice(itemIndex, 1);
    await borrower.save();
    return res.status(200).send({
      success: true,
      data: borrower
    })
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

  async getBorrowedBooks(req, res) {
    const email = req.query.email.toLowerCase();
    console.log(email);
    const books = await bookServices.getBorrowedBooks(email);
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
