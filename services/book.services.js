import { bookModel } from "../models/book.model.js";
import { borrowModel } from "../models/borrowing.model.js";
class BookService {
  async create(data) {
    const book = await bookModel.create(data);
    return book;
  }

  async findById(id) {
    const book = await bookModel.findById(id);
    return book;
  }

  async getAllBooks(author, title, genre) {
    const query = {}
  if (author !== author){
    query.author = author
  }
  if (title !== undefined){
    query.title = title
  }
  if (genre !== undefined){
    query.genre = genre
  }
  console.log(query);
    const books = await bookModel.find(query);
    return books;
  }

  async getAllBorrowedBooks() {
    const borrowedBooks = await borrowModel.find(); 
    const bookIds = borrowedBooks.map((borrowedBook) => borrowedBook.bookId);
    const booksPromises = bookIds.map(async (id) => bookModel.findOne({ _id: id }));
    const books = await Promise.all(booksPromises);
    return books
  }
}

export default new BookService();
