import Database from 'better-sqlite3'
const taskDb = new Database('tasks.db');

// Create table if it doesn’t exist
taskDb.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    done BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIEMSTAMP
  )
`).run();

export function getTasks(currentCount = 0, doneFilter = null){
    let query = 'SELECT * from tasks';
    let params = [];
    
    if (doneFilter !== null) {
        const doneValue = doneFilter === 'true' ? 1 : 0;
        query += ' WHERE done = ?';
        params.push(doneValue);
    }
    
    const limit = currentCount + 5;
    query += ' LIMIT ? OFFSET 0';
    params.push(limit);

    if(sortBy === 'title') {
        query +=' ORDER BY title ASC'
    }
    
    const tasks = taskDb.prepare(query).all(...params);
    
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
         "INSERT INTO tasks (title, description, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
     ).run(title, description);

     // Return the created task
     const task = taskDb.prepare(
         'SELECT * FROM tasks WHERE id = ?'
     ).get(result.lastInsertRowid);

     return task;
}

export function updateTask(id, title, done){
    const update = taskDb.prepare(
        'UPDATE tasks SET title=?, done=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
    ).run(title, done ? 1 : 0, id);
 
    const task = taskDb.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(id);
    return task;
}

export function deleteTask(id){
    const task = taskDb.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(id);

    if(!task){
        return false;
    }

    taskDb.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return true;
}

// GET /tasks?search=milk
export function searchTasks(searchTerm) {
    const tasks = taskDb.prepare(
        'SELECT * FROM tasks WHERE title LIKE ?'
    ).all(`%${searchTerm}%`);
    return tasks;
}

// GET /tasks?done=true
export function getTasksDoneStatus(doneStatus){
    const doneValue = donesStatus === 'true' ? 1 : 0
    const tasks = taskDb.prepare(
        'SELECT * FROM tasks WHERE done = ?'
    ).all(doneValue);

    return tasks;
}

// GET /stats
export function getStats() {
    const stats = taskDb.prepare(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
        FROM tasks
    `).get();
    
    return stats;
}