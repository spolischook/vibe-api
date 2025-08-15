import { DataSource } from "typeorm";
import { Todo } from "../models/Todo";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Create a data source configuration
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_NAME || "todo.sqlite",
  entities: [Todo],
  synchronize: process.env.NODE_ENV === "development", // Auto-create tables in development
  logging: process.env.NODE_ENV === "development",
});

// Initialize the database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};
