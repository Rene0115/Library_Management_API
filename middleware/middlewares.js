import express from "express";
import cors from "cors";
import router from '../routes/index.router.js';
import errorHandler from "./error.middleware.js";
import morgan from "morgan";
import helmet from "helmet";

const middleware = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(router);
  app.use(errorHandler);
  app.use("*", (req, res) => {
    res.status(200).send("Server is Running Check API docs");
  });
};

export default middleware;
