# Task CRUD API

A simple Task CRUD API with in-memory storage, built with Express.js and documented with Swagger/OpenAPI.

**Note on Validation Messages**: The PUT endpoint uses slightly more descriptive validation messages ("Title must be a non-empty string" and "Done must be a boolean") compared to the POST endpoint's "Title is required" message. All status codes and error formats match the specifications exactly.

## Installation & Running

```bash
npm install
npm start
```

The server runs on port 3000.

## Available Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /tasks` - Get all tasks (with optional pagination via `limit` and `offset` query params)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /docs` - Swagger UI documentation

## Testing the API

Test the CRUD cycle with these curl commands:

### 1. Get API Information
```bash
curl -i http://localhost:3000/
```
Expected: Status 200 with API info JSON

### 1.5. Get Tasks with Pagination
```bash
# Get first 2 tasks
curl -i http://localhost:3000/tasks?limit=2

# Get tasks starting from index 1 (skip first task)
curl -i http://localhost:3000/tasks?offset=1

# Get 2 tasks starting from index 1
curl -i http://localhost:3000/tasks?limit=2&offset=1
```
Expected: Status 200 with paginated task array

### 2. Get Task by ID
```bash
curl -i http://localhost:3000/tasks/1
```
Expected: Status 200 with task JSON

### 3. Create a New Task
```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```
Expected: Status 201 with created task JSON

### 4. Update a Task
```bash
curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"New title","done":true}'
```
Expected: Status 200 with updated task JSON

### 5. Delete a Task
```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```
Expected: Status 204 with empty body

## Pre-seeded Data

The API starts with three pre-seeded tasks:
- `{ id: 1, title: "Buy milk", done: false }`
- `{ id: 2, title: "Clean room", done: true }`
- `{ id: 3, title: "Study", done: false }`

## Development

For development with auto-reload:
```bash
npm run dev
```

## Swagger Documentation

Interactive API documentation is available at `http://localhost:3000/docs`