import mongoose from "mongoose";
import moment from "moment-timezone";

const borrowSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    borrowDate: {
      required: true,
      type: Date,
      default: () => moment().tz("Africa/Lagos").toDate() // Store as Date object
    },
    returnDate: {
      required: true,
      type: Date // You need to specify a valid type here
    },
    books: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Book'
        }
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

// Virtual property to format borrowDate as a string
borrowSchema.virtual("formattedBorrowDate").get(function () {
  return moment(this.borrowDate).tz("Africa/Lagos").format("LL");
});

// Virtual property to format returnDate as a Moment.js date
borrowSchema.virtual("formattedReturnDate").get(function () {
  return moment(this.returnDate).tz("Africa/Lagos").format("LL");
});
export const borrowerModel = mongoose.model("Borrowers", borrowSchema);
