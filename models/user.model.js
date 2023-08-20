import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true
    },
    password: {
      required: true,
      type: String
    },
    libraryName: {
      required: true,
      type: String
    },
    phoneNumber: {
      required: true,
      type: Number
    },
    verified: {
      default: false,
      type: Boolean
    },
    image: {
      default: "image",
      type: String
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.generateToken = function t() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  return token;
};

export const userModel = mongoose.model("User", userSchema);
