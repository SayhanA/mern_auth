import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

// Middlewars ----------
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//routes
app.use((req, res, next) => {
  res.send("<h1>Hello world.</h1>");
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
