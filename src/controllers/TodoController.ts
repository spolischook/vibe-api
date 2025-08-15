import { Request, Response } from "express";
import { AppDataSource } from "../db/database";
import { Todo } from "../models/Todo";

export class TodoController {
  /**
   * Find todos with optional pagination
   */
  public static async findTodos(req: Request, res: Response): Promise<void> {
    try {
      const since = req.query.since ? parseInt(req.query.since as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const todoRepository = AppDataSource.getRepository(Todo);
      const queryBuilder = todoRepository.createQueryBuilder("todo");
      
      if (since) {
        queryBuilder.where("todo.id > :since", { since });
      }
      
      queryBuilder.limit(limit);
      const todos = await queryBuilder.getMany();
      
      res.status(200).json(todos);
    } catch (error) {
      console.error("Error finding todos:", error);
      res.status(500).json({ 
        code: 500, 
        message: "Internal server error" 
      });
    }
  }

  /**
   * Add a new todo item
   */
  public static async addOne(req: Request, res: Response): Promise<void> {
    try {
      const { description, completed } = req.body;
      
      if (!description) {
        res.status(400).json({ 
          code: 400, 
          message: "Description is required" 
        });
        return;
      }
      
      if (description.length < 1) {
        res.status(400).json({ 
          code: 400, 
          message: "Description must have at least 1 character" 
        });
        return;
      }
      
      const todo = new Todo();
      todo.description = description;
      if (completed !== undefined) {
        todo.completed = completed;
      }
      
      const todoRepository = AppDataSource.getRepository(Todo);
      const savedTodo = await todoRepository.save(todo);
      res.status(201).json(savedTodo);
    } catch (error) {
      console.error("Error adding todo:", error);
      res.status(500).json({ 
        code: 500, 
        message: "Internal server error" 
      });
    }
  }

  /**
   * Update an existing todo item by ID
   */
  public static async updateOne(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { description, completed } = req.body;
      
      const todoRepository = AppDataSource.getRepository(Todo);
      const todo = await todoRepository.findOneBy({ id });
      
      if (!todo) {
        res.status(404).json({ 
          code: 404, 
          message: `Todo with ID ${id} not found` 
        });
        return;
      }
      
      if (description !== undefined) {
        if (description.length < 1) {
          res.status(400).json({ 
            code: 400, 
            message: "Description must have at least 1 character" 
          });
          return;
        }
        todo.description = description;
      }
      
      if (completed !== undefined) {
        todo.completed = completed;
      }
      
      const updatedTodo = await todoRepository.save(todo);
      res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ 
        code: 500, 
        message: "Internal server error" 
      });
    }
  }

  /**
   * Delete a todo item by ID
   */
  public static async destroyOne(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      const todoRepository = AppDataSource.getRepository(Todo);
      const todo = await todoRepository.findOneBy({ id });
      
      if (!todo) {
        res.status(404).json({ 
          code: 404, 
          message: `Todo with ID ${id} not found` 
        });
        return;
      }
      
      await todoRepository.remove(todo);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ 
        code: 500, 
        message: "Internal server error" 
      });
    }
  }
}
