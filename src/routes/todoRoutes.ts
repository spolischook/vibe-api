import { Router } from "express";
import { TodoController } from "../controllers/TodoController";

const router = Router();

// GET / - Find todos
router.get("/", TodoController.findTodos);

// POST / - Create a new todo
router.post("/", TodoController.addOne);

// PUT /:id - Update a todo by ID
router.put("/:id", TodoController.updateOne);

// DELETE /:id - Delete a todo by ID
router.delete("/:id", TodoController.destroyOne);

export default router;
