const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// In-memory storage with pre-seeded tasks
const tasks = [
  { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Clean room", done: true },
  { id: 3, title: "Study", done: false }
];

app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'A simple Task CRUD API with in-memory storage',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Returns a list of all tasks with optional pagination
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of tasks to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of tasks to skip
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   done:
 *                     type: boolean
 */
app.get('/tasks', (req, res) => {
  let result = tasks;
  
  // Handle pagination
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  
  if (offset > 0) {
    result = result.slice(offset);
  }
  
  if (limit !== undefined) {
    result = result.slice(0, limit);
  }
  
  res.json(result);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: Returns a specific task by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 done:
 *                   type: boolean
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  
  res.json(task);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task with the provided title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 done:
 *                   type: boolean
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  
  // Validate title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }
  
  // Create new task with next ID
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: newId,
    title: title.trim(),
    done: false
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates an existing task's title and/or done status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 done:
 *                   type: boolean
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  
  const { title, done } = req.body;
  
  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    task.title = title.trim();
  }
  
  // Validate done if provided
  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: "Done must be a boolean" });
    }
    task.done = done;
  }
  
  res.json(task);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});