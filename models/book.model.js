import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    availableCopies: {
      type: Number,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

export const bookModel = mongoose.model("Book", bookSchema);
