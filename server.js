import express from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { tasks } from './task.js'
import indexRoute from './routes/index.route.js'



const app = express()
const PORT = 4000;

app.use(express.json())

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'A simple Task CRUD API',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing JSDoc comments
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api', indexRoute);


app.get('/', (req,res)=> {
    res.send("Hello, server!")
    console.log('Swagger');
})

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})