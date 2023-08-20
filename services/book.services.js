import { bookModel } from "../models/book.model.js";

class BookService {
  async create(data) {
    const book = await bookModel.create(data);
    return book;
  }

  async findById(id) {
    const book = await bookModel.findById(id);
    return book;
  }
}

export default new BookService();
