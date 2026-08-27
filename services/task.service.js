import * as db from '../database/dbInit.js'

export async function getTasks(currentCount = 0) {
    const tasks = db.getTasks(currentCount);
    if (!tasks) {
        return false;
    }

    return {
        success: true,
        tasks: tasks,
        currentCount: currentCount + 5
    };
}

export async function getTaskById(taskId) {
    const task = db.getTaskById(taskId);
    if(!task){
        return false;
    }
    return task;
}

export async function createTask(title, description) {
    if (!title || title.trim() === "") {
        return false;
    }
    const task = db.createTask(title, description);
    return task;
}

export async function updateTask(id, title, done) {
    const task = db.updateTask(id, title, done);
    if (!task) return false;

    return task;
}

export async function deleteTask(id) {
    const result = db.deleteTask(id);
    if (!result) return false;

    return true;
}