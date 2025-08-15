# Todo API by Vibe Coding

This is a RESTful API for Todo List management implemented with Node.js, Express, TypeScript, and SQLite following the [Swagger documentation](./swagger.yaml).

## Technology Stack

- Node.js
- TypeScript
- Express.js
- TypeORM
- SQLite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Create a `.env` file based on the `.env.example` file
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

### API Endpoints

- `GET /` - Get all todos with optional pagination
  - Query parameters:
    - `since` (optional): Get todos with ID greater than this value
    - `limit` (optional, default: 20): Maximum number of todos to return

- `POST /` - Create a new todo
  - Request body:
    - `description` (required): Todo description
    - `completed` (optional, default: false): Todo completion status

- `PUT /:id` - Update a todo by ID
  - Request body:
    - `description` (optional): Todo description
    - `completed` (optional): Todo completion status

- `DELETE /:id` - Delete a todo by ID

### Testing the API

Use the provided test script to check if all endpoints are working correctly:

```bash
./cmd/test-api.sh
```

## Project Structure

- `src/` - Source code
  - `controllers/` - Request handlers
  - `models/` - Data models
  - `routes/` - API route definitions
  - `middleware/` - Custom middleware
  - `db/` - Database configuration
- `cmd/` - Command-line scripts (including test script)

## License

ISC
