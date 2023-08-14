import express from "express";
import pino from "pino";
import database from "./config/db.config.js";
import dotenv from "dotenv";
import middleware from "./middleware/middlewares.js";

dotenv.config();

const app = express();
middleware(app);

export const logger = pino();

const start = (port) => {
  database();
  app.listen(port, () => {
    logger.info("Listening on port " + port);
  });
};
const port = process.env.PORT || 4000;
start(port);
