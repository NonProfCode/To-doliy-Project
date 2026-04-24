'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  expDate: string;
  dateCreated: string;
  priority: 'Low' | 'Medium' | 'High';
}

export default function Priority_Card() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  


  // Get today's tasks
const today = new Date().toISOString().split('T')[0];

const todayTasks = tasks.filter(task =>
  task.expDate === today
);

  // Sort by priority
  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  const sortedTasks = [...todayTasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

const toggleTask = (id: number) => {
  const updatedTasks = tasks.map(task =>
    task.id === id
      ? { ...task, isCompleted: !task.isCompleted }
      : task
  );

  setTasks(updatedTasks);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
};

  return (
    <div className="bg-[#F9D965] p-4 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Priority Task for Today</h2>

      {sortedTasks.length === 0 ? (
        <p className="text-gray-600">No tasks for today 🎉</p>
      ) : (
        <div className="justify-between">
        <ul>
          {sortedTasks.slice(0, 5).map(task => (
            <li key={task.id} className="flex items-center justify-between mb-2 text-2xl">
              <span className={task.isCompleted ? "line-through" : ""}>
                {task.name}
              </span>
              
              <div>
                <span
                className={`text-xs px-2 py-1 rounded-full
                  ${task.priority === 'High'
                    ? 'bg-red-600 text-white'
                    : task.priority === 'Medium'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-green-500 text-white'
                  }`}
              >
                {task.priority}
              </span>
                <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTask(task.id)}
                        className="ml-2 checkbox border-black bg-[#FCFF58] shadow-[#FCFF58] shadow-2xl text-black"
                      />
              </div>
            
            </li>
          ))}
        </ul> 
        <div className="flex justify-center">
        <Link href="/dashboard/Task-Management-Page" className="btn border-[#F9D965] bg-[#FFB22C] shadow-[#F9D965] shadow-2xl text-black mt-2 rounded-2xl border-2 hover:bg-[#ffe9b3] transition-colors duration-200">
          View All
        </Link>
        </div>

        </div>
      )}
    </div>
    
  );
  
}