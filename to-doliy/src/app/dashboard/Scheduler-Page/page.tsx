'use client';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  expDate: string;
  dateCreated: string;
}

const getMonthYearLabel = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function Scheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', expDate: '', priority: 'Low' });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem('schedulerTasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('schedulerTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Task = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description,
      isCompleted: false,
      expDate: newTask.expDate,
      dateCreated: new Date().toISOString(),

    };
    setTasks((prev) => [...prev, newEntry]);
    setNewTask({ name: '', description: '', expDate: '', priority: 'Low' });
    (document.getElementById('my_modal_1') as HTMLDialogElement)?.close();
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInCurrentView = () => {
    if (viewMode === 'Month') {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
    } else if (viewMode === 'Week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      return Array.from({ length: 7 }, (_, i) => new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));
    } else if (viewMode === 'Day') {
      return [currentDate];
    }
    return [];
  };

  const daysInView = getDaysInCurrentView();

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    (document.getElementById('edit_task_modal') as HTMLDialogElement)?.showModal();
  };

  const updateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      setTasks((prev) =>
        prev.map((task) => (task.id === selectedTask.id ? selectedTask : task))
      );
      setSelectedTask(null);
      (document.getElementById('edit_task_modal') as HTMLDialogElement)?.close();
    }
  };

  const deleteTask = () => {
    if (selectedTask) {
      setTasks((prev) => prev.filter((task) => task.id !== selectedTask.id));
      setSelectedTask(null);
      (document.getElementById('edit_task_modal') as HTMLDialogElement)?.close();
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    localStorage.setItem("schedulerTasks", JSON.stringify(updatedTasks));
  };

  const getWeeklyTasks = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return tasks.filter((task) => {
      const taskDate = new Date(task.expDate);
      return taskDate >= startOfWeek && taskDate <= today;
    });
  };

  const weeklyTasks = getWeeklyTasks();

  const calculateScheduleCompletion = () => {
    const completedSchedules = tasks.filter(task => task.isCompleted).length;
    return tasks.length > 0 ? Math.round((completedSchedules / tasks.length) * 100) : 0;
  };

  const scheduleCompletion = calculateScheduleCompletion();

  return (
    <>
      <div className='bg-[#F9D965] p-4 rounded-3xl flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Today {tasks.filter(task => task.expDate === new Date().toISOString().split('T')[0]).length} events</h1>
        <button
          onClick={() =>
            (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()
          }
          className="btn rounded-full bg-[#F3C623] px-3 sm:px-4 py-2 text-lg sm:text-xl hover:bg-[#FCFF58] border-none text-black shadow-md transition-colors duration-200"
        >
          <span className="text-xl font-bold">+</span>
          <span className="hidden sm:inline ml-1">Add Event</span>
        </button>
      </div>

      <div className='bg-[#F9D965] p-4 rounded-3xl mt-4'>
        <div className="lg:flex  lg:flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
            <div>
              <button
                type="button"
                className="p-2 bg-[#FFB22C] font-bold"
                onClick={() => handleMonthChange('prev')}
              >
                <FaArrowLeft />
              </button>
              <button
                type="button"
                className="p-2 bg-[#FFB22C] font-bold"
                onClick={() => handleMonthChange('next')}
              >
                <FaArrowRight />
              </button>
            </div>
            <h1 className="text-base font-semibold text-gray-900 bg-[#FFB22C] rounded-3xl px-4 py-2">
              {getMonthYearLabel(currentDate)}
            </h1>

            <div className="relative inline-block text-left">
              <select
                className="block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#FFB22C] text-sm font-medium text-gray-900 hover:bg-[#FFC857] focus:outline-none"
                id="view-dropdown"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'Month' | 'Week' | 'Day')}
              >
                <option value="Month">Month</option>
                <option value="Week">Week</option>
                <option value="Day">Day</option>
              </select>
            </div>
          </header>

          <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {daysInView.map((date) => {
                const formattedDate = date.toISOString().split('T')[0];
                const dayTasks = tasks.filter((task) => task.expDate === formattedDate);

                return (
                  <div key={formattedDate} className="relative bg-white px-3 py-2">
                    <time dateTime={formattedDate}>{date.getDate()}</time>
                    {dayTasks.length > 0 && (
                      <ol className="mt-2">
                        {dayTasks.map((task) => (
                          <li key={task.id}>
                            <a
                              href="#"
                              className="group flex"
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(task);
                              }}
                            >
                              <p className="flex-auto truncate font-medium text-gray-900 bg-amber-200">
                                {task.name}    
                              </p>
                            </a>
                            <p className="flex-auto truncate font-medium text-gray-900">
                              {task.description}
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}
                    {dayTasks.length > 0 && (
                      <div>
                        {dayTasks.map((task) => (
                          <div key={task.id}>
                            <input
                              type="checkbox"
                              checked={task.isCompleted}
                              onChange={() => toggleTaskCompletion(task.id)}
                            />
                            <span>{task.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-[#F9D965]">
          <h3 className="font-bold text-lg mb-4">Add Event</h3>
          <form
            onSubmit={addTask}
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

      <dialog id="edit_task_modal" className="modal">
        <div className="modal-box bg-[#F9D965]">
          <h3 className="font-bold text-lg mb-4">Edit Task</h3>
          {selectedTask && (
            <form
              onSubmit={updateTask}
              className="grid grid-cols-1 gap-4"
            >
              <input
                type="text"
                maxLength={30}
                placeholder="Task name"
                value={selectedTask.name}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, name: e.target.value })
                }
                required
                className="border p-2 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, description: e.target.value })
                }
                required
                className="border p-2 rounded-lg h-28 resize-none"
              />
              <input
                type="date"
                value={selectedTask.expDate}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, expDate: e.target.value })
                }
                required
                className="border p-2 rounded-lg"
              />

              <div className="flex justify-between gap-2 mt-4">
                <button
                  type="button"
                  className="btn bg-red-700 px-4 py-2 rounded-lg text-white"
                  onClick={deleteTask}
                >
                  Delete Task
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-500 px-4 py-2 rounded-lg text-white"
                    onClick={() => {
                      setSelectedTask(null);
                      (document.getElementById('edit_task_modal') as HTMLDialogElement)?.close();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </dialog>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Schedule Completion</h3>
        <div className="w-full bg-gray-300 rounded-full h-6">
          <div
            className="bg-blue-500 h-6 rounded-full"
            style={{ width: `${scheduleCompletion}%` }}
          ></div>
        </div>
        <p className="text-lg mt-2">{scheduleCompletion}% of schedules completed</p>
      </div>
    </>
  );
}