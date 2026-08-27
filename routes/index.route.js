import express from 'express'
import taskRoute from './task.route.js'

const indexRoute = express();

indexRoute.use('/tasks', taskRoute)

export default indexRoute;