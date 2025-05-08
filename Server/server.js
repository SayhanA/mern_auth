import { app } from "./app.js";
import "dotenv/config";
import { connectDB } from "./db/dbConnect.js";

const port = process.env.PORT || 4000;

// Connect to MongoDB first, then start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
});

