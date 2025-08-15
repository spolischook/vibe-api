import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import { initializeDatabase } from "./db/database";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Configure Express to parse any JSON content type
app.use(express.json({
  type: ['application/json', 'application/io.goswagger.examples.todo-list.v1+json']
}));
app.use(express.urlencoded({ extended: true }));

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, { 
    headers: req.headers,
    body: req.body
  });
  next();
});

// Custom middleware to set content type for all responses
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/io.goswagger.examples.todo-list.v1+json");
  next();
});

// Routes
app.use("/", todoRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
