import Database from 'better-sqlite3'
const taskDb = new Database('tasks.db');

export function getTasks(){
    const tasks = taskDb.prepare(
        'SELECT * from tasks'
    ).all();
    if(!tasks){
        return false;
    }
    return tasks
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

// export function createTask(title, description){
//     const task = taskDb.prepare(
//         INSERT IN
//     )
// }
