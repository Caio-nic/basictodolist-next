'use client';

import { useState, useEffect } from 'react';
import './styles.css'; // Importando o CSS

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    try {
      const res = await fetch('http://localhost:3000/tasks'); // Porta 3000
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async (): Promise<void> => {
    if (newTask.trim() === '') return;

    try {
      const response = await fetch('http://localhost:3000/tasks', { // Porta 3000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask, completed: false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewTask('');
      fetchTasks(); // Recarrega as tarefas após adicionar
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    await fetch(`http://localhost:3000/tasks/${id}`, { // Porta 3000
      method: 'DELETE',
    });
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nova tarefa"
      />
      <button className="add" onClick={addTask}>Adicionar</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button className="delete" onClick={() => deleteTask(task.id)}>Excluir</button>
            </li>
        ))}
      </ul>
    </div>
  );
}


