import express from "express";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, globalErrorHandler } from "./middlewars/errorHandler.js";
import userRouter from "./routes/user.js";

export const app = express();

// Set view engine ------
app.set("view engine", "ejs");

// Middlewars ----------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));
app.use(express.static(path.join(path.resolve(), "views")));

//routes
app.use("/api/v1/user", userRouter);

app.use((req, res, next) => {
  res.render("index", {
    title: "Hello",
  });
});

// 404 handler ----------
app.use(errorHandler);

// Global error handler ----------
app.use(globalErrorHandler);
