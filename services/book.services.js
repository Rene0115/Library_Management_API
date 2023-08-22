import { bookModel } from "../models/book.model.js";
import { borrowerModel } from "../models/borrowing.model.js";
import mongoose from "mongoose";
class BookService {
  async create(data) {
    const book = await bookModel.create(data);
    return book;
  }

  async findById(id) {
    const objectId = new mongoose.Types.ObjectId(id);
    const book = await bookModel.findById(objectId);
    return book;
  }

  async getAllBooks(author, title, genre) {
    const query = {};
    if (author !== author) {
      query.author = author;
    }
    if (title !== undefined) {
      query.title = title;
    }
    if (genre !== undefined) {
      query.genre = genre;
    }

    const books = await bookModel.find(query);
    return books;
  }

  async getBorrowedBooks(email) {
    const borrower = await borrowerModel.findOne({ email: email });
    console.log(borrower)
    const bookIds = borrower.books.map((book) => book.id);
    const bookPromises = bookIds.map(async (id) =>
      bookModel.findOne({ _id: id })
    );
    const books = await Promise.all(bookPromises);
    return books;
  }

  checkForEmptyProperty(data) {
    let undefinedProperties = [];

    if (data.name === undefined) {
      undefinedProperties.push("name");
    }

    if (data.email === undefined) {
      undefinedProperties.push("email");
    }

    if (data.returnDate === undefined) {
      undefinedProperties.push("returnDate");
    }

    if (data.book[0].id === undefined) {
      undefinedProperties.push("book id");
    }

    if (undefinedProperties.length > 0) {
      return undefinedProperties;
    } else {
      return true;
    }
  }
}

export default new BookService();
