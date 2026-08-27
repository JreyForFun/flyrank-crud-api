import * as taskService from '../services/task.service.js';

export async function getTasks(req, res) {
    try {
        const currentCount = req.query.currentCount ? parseInt(req.query.currentCount) : 0;

        const result = await taskService.getTasks(currentCount);
        if (!result) {
            return res.status(400).json({ success: false, message: "Failed to get tasks" });
        }
        return res.status(200).json({success: true, ...result});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


export async function getTaskById(req, res) {
    try {
    const { id } = req.params;
    const task = await taskService.getTaskById(Number(id));
    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }
    return res.status(200).json({
        success: true,
        task
    });
} catch (error) {
    res.status(500).json({success: false, message: error.message});
}
}

export async function createTask(req, res) {
    try {
    const { title, description } = req.body;
    const result = await taskService.createTask(title, description);
    if (!result) {
        return res.status(400).json({
            success: false,
            message: "Failed to create task"
        });
    }
    return res.status(201).json({
        success: true,
        task: result
    });
} catch (error) {
    res.status(500).json({success: false, message: error.message});
}
}

export async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, done } = req.body;
        const result = await taskService.updateTask(Number(id), title, done);

        if (!result) {
            return res.status(404).json({ error: `Task ${id} not found` });
        }
        return res.status(200).json({ success: true, task: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const result = await taskService.deleteTask(Number(id));

        if (!result) {
            return res.status(404).json({ error: `Task ${id} not found` });
        }
        return res.status(204).json({
            success: true,
            message: `Task ${id} deleted`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
