import mongoose from "mongoose";
import { logger } from "../app.js";
import dotenv from "dotenv";
dotenv.config();

const database = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      logger.info("Database connection established");
    })
    .catch(logger.error);
};

export default database;
