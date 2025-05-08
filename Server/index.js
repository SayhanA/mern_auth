import express from "express";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

// Set view engine ------
app.set("view engine", "ejs");

// Middlewars ----------
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));
app.use(express.static(path.join(path.resolve(), "views")));

//routes
app.use((req, res, next) => {
  res.render("index", {
    title: "Hello",
  });
});

// 404 handler ----------
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}`)
);
