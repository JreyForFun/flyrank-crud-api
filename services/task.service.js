import { tasks } from '../task.js'

export async function getTasks(limit, offset) {
    if (tasks.length === 0) {
        return false;
    }

    const start = offset;
    const end = start + limit;
    const paginated = tasks.slice(start, end);

    return {
        success: true,
        tasks: paginated,
        total: tasks.length,
        limit,
        offset
    };
}

export async function getTaskById(taskId) {
    const task = tasks.find(t => t.id === taskId);
    return task;
}

export async function createTask(title, description) {
    if (!title || title.trim() === "") {
        return false;
    }
    const task = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
        status: false
    };
    tasks.push(task);
    return task;
}

export async function updateTask(id, title, done) {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    if (!title && typeof done !== "boolean") {
        return false;
    }

    if (title) task.title = title;
    if (typeof done === "boolean") task.done = done;

    return task;
}

export async function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
}