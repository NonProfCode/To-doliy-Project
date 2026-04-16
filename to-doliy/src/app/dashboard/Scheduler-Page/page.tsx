'use client';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { IoCheckmarkDone, IoCalendar } from "react-icons/io5";

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

const formatDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayDateString = () => {
  return formatDateToString(new Date());
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

  // Handle drag and drop events
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a valid droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const sourceDate = source.droppableId;
    const destinationDate = destination.droppableId;

    if (sourceDate !== destinationDate) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, expDate: destinationDate } : task
        )
      );
    }
  };

  return (
    <>
      <div className='bg-[#F9D965] p-4 rounded-3xl flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Today {tasks.filter(task => task.expDate === getTodayDateString()).length} events</h1>
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

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {daysInView.map((date) => {
                  const formattedDate = formatDateToString(date);
                  const dayTasks = tasks.filter((task) => task.expDate === formattedDate);

                  return (
                    <Droppable key={formattedDate} droppableId={formattedDate}>
                      {(provided, snapshot) => (
                        <div
                          key={formattedDate}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`relative bg-white px-3 py-2 min-h-32 ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : ''
                          }`}
                        >
                          <time dateTime={formattedDate} className="font-semibold text-gray-800">
                            {date.getDate()}
                          </time>
                          {dayTasks.length > 0 && (
                            <ol className="mt-2 space-y-1">
                              {dayTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                  {(provided, snapshot) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-2 rounded text-sm cursor-move transition-all ${
                                        task.isCompleted
                                          ? 'bg-green-200 line-through text-gray-600'
                                          : 'bg-amber-200 text-gray-900 hover:shadow-md'
                                      } ${snapshot.isDragging ? 'shadow-lg rotate-3' : ''}`}
                                    >
                                      <a
                                        href="#"
                                        className="flex items-start gap-2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          openEditModal(task);
                                        }}
                                      >
                                        <span className="flex-shrink-0 pt-0.5">
                                          {task.isCompleted ? (
                                            <IoCheckmarkDone className="text-green-600" size={16} />
                                          ) : (
                                            <IoCalendar className="text-amber-600" size={16} />
                                          )}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{task.name}</p>
                                          <p className="text-xs truncate opacity-75">{task.description}</p>
                                        </div>
                                      </a>
                                    </li>
                                  )}
                                </Draggable>
                              ))}
                            </ol>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
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

    </>
  );
}