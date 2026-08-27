import Database from 'better-sqlite3'
const taskDb = new Database('tasks.db');

// Create table if it doesn’t exist
taskDb.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    done BOOLEAN DEFAULT 0
  )
`).run();

export function getTasks(currentCount = 0){
    const limit = currentCount + 5; // Add 5 more items each time
    const tasks = taskDb.prepare(
        'SELECT * from tasks LIMIT ? OFFSET 0'
    ).all(limit);
    if(!tasks){
        return false;
    }
    return tasks;
}

export function getTaskById(id){
    const task = taskDb.prepare(
        'SELECT * from tasks WHERE id = ?'
    ).get(id);
    if(!task){
        return false
    }
    return task;
}

export function createTask(title, description){
     const result = taskDb.prepare(
         "INSERT INTO tasks (title, description) VALUES (?, ?)"
     ).run(title, description);

     // Return the created task
     const task = taskDb.prepare(
         'SELECT * FROM tasks WHERE id = ?'
     ).get(result.lastInsertRowid);

     return task;
}

