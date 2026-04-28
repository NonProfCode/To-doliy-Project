'use client';

import { useEffect, useState } from "react";

interface Task {
  id: number;
  name: string;
  description: string;
  expDate: string;
}

export default function Schedule_Card() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("schedulerTasks");
    if (storedTasks) {
      const today = new Date().toISOString().split("T")[0];
      const filteredTasks = JSON.parse(storedTasks).filter((task: Task) => task.expDate === today);
      setTasks(filteredTasks);
    }
  }, []);

  return (
    <div className="bg-[#F9D965] p-4 rounded-2xl shadow-lg shadow-black/20">
      <h2 className="text-2xl font-bold mb-4">Schedule for Today</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No events for today 🎉</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2 text-xl">
              <div className="flex flex-col">
                <span className="">{task.name}</span>
                <span className="text-sm text-gray-700">Description: {task.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}