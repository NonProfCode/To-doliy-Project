'use client';
import { useEffect, useState } from 'react';
import { GoKebabHorizontal } from "react-icons/go";

//Object structure for tasks
interface Task {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  expDate: string;
  dateCreated: string;
  priority: 'Low' | 'Medium' | 'High';
}

//task management page with local storage persistence, task grouping by date, and priority sorting
export default function Task_Management() {
  // Stores all task
  const [tasks, setTasks] = useState<Task[]>([]);
  //prevent local storage override on first load
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    expDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tasks');
      if (stored) setTasks(JSON.parse(stored));
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const updateProgressBar = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      const completedTasks = tasks.filter((task: Task) => task.isCompleted).length;
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
      localStorage.setItem("taskProgress", JSON.stringify(progress));
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    updateProgressBar();
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Task = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description,
      isCompleted: false,
      expDate: newTask.expDate,
      dateCreated: new Date().toISOString(),
      priority: newTask.priority,
    };
    setTasks(prev => [...prev, newEntry]);
    setNewTask({ name: '', description: '', expDate: '', priority: 'Medium' });
  };

  

const priorityOrder: Record<'High' | 'Medium' | 'Low', number> = {
  High: 1,
  Medium: 2,
  Low: 3
};

const groupTasksByDate = () => {
  const groups: { [date: string]: Task[] } = {};

  tasks.forEach(task => {
    if (!groups[task.expDate]) groups[task.expDate] = [];
    groups[task.expDate].push(task);
  });

  const sortedDates = Object.keys(groups).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime(); // newest first
  });

  return sortedDates.map(date => ({
    date,
    tasks: groups[date].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }));
};
// Label each date
const getDateLabel = (dateStr: string) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const date = new Date(dateStr);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const calculateTaskCompletion = () => {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
};

const taskCompletion = calculateTaskCompletion();

  if (!isLoaded) return null;

  return (
    <>
      {/* Modal */}
<dialog id="my_modal_1" className="modal">
  <div className="modal-box bg-[#F9D965]">
    <h3 className="font-bold text-lg mb-4">Add Task</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addTask(e);
        (document.getElementById('my_modal_1') as HTMLDialogElement)?.close();
      }}
      className="grid grid-cols-1 gap-4"
    >
      <input
        type="text"
        maxLength={30}
        placeholder="Task name"
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        required
        className="border p-2 rounded-lg"
      />
      <textarea
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        required
        className="border p-2 rounded-lg h-28 resize-none"
      />
      <input
        type="date"
        value={newTask.expDate}
        onChange={(e) => setNewTask({ ...newTask, expDate: e.target.value })}
        required
        className="border p-2 rounded-lg"
      />
      <select
        value={newTask.priority}
        onChange={(e) =>
          setNewTask({ ...newTask, priority: e.target.value as 'Low' | 'Medium' | 'High' })
        }
        className="border p-2 rounded-lg"
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>

      {/* Buttons aligned */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="btn bg-red-700 px-4 py-2 rounded-lg text-white"
          onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement)?.close()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </div>
    </form>
  </div>
</dialog>


      {/* Main task list */}
<div className="bg-[#F9D965] p-4 rounded-3xl text-black">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
      <p className="text-2xl  font-semibold">
        Today: {
          tasks.filter(task => {
            const today = new Date();
            const taskDate = new Date(task.expDate);
            return taskDate.toDateString() === today.toDateString();
          }).length
        } available task(s)
      </p>

      <button
        onClick={() =>
          (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()
        }
        className="btn rounded-full bg-[#F3C623] px-3 sm:px-4 py-2 text-lg sm:text-xl hover:bg-[#FCFF58] border-none text-black shadow-md transition-colors duration-200"
      >
        <span className="text-xl font-bold">+</span>
        <span className="hidden sm:inline ml-1">Add Task</span>
      </button>
    </div>
    
        {/* Task list grouped by date */}
    <div className="space-y-8 mt-4 font-bold">
      {groupTasksByDate().map(({ date, tasks }) => (
        <div key={date}>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{getDateLabel(date)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-2 rounded-lg bg-[#FCFF58] shadow-black/50 shadow-md w-full h-auto min-h-[13rem]"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`text-base sm:text-lg ${task.isCompleted ? 'line-through decoration-2' : ''}`}
                    >
                      {task.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTask(task.id)}
                        className="ml-2 checkbox border-black bg-[#FCFF58] shadow-[#FCFF58] shadow-2xl text-black"
                      />
                      <details className="dropdown">
                        <summary className="btn border-[#FCFF58] bg-[#FCFF58] shadow-[#FCFF58] shadow-2xl text-black text-lg sm:text-xl w-8 sm:w-9 p-1 sm:p-2">
                          <GoKebabHorizontal />
                        </summary>
                        <ul className="menu dropdown-content rounded-box w-44 sm:w-52 p-2 bg-white">
                          <li>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="hover:bg-red-600 hover:text-white w-full text-left px-4 py-2"
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </details>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-center p-4 break-words">{task.description}</p>
                </div>

                <div className="flex justify-between items-center mt-2 flex-wrap gap-2 text-xs sm:text-sm">
                  <p>Due: {new Date(task.expDate).toLocaleDateString()}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-[0.7rem] sm:text-xs font-semibold
                      ${task.priority === 'High'
                        ? 'bg-red-600'
                        : task.priority === 'Medium'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-green-600'
                      }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
    </>
  );
}
