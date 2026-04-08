'use client';

import { useState, useEffect, ClassAttributes, HTMLAttributes, JSX, Ref, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, TableHTMLAttributes } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";


type TaskStatus = "idle" | "running" | "paused" | "completed";

interface Log {
  id: number;             
  name: string;           
  description: string;    
  startTime?: number;     // store as timestamp (ms)
  endTime?: number;       
  duration: number;       // total ms
  status: TaskStatus;   
}

export default function Time_Logger() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // For modal new log form
  const [newLog, setNewLog] = useState({
    name: "",
    description: ""
  });

  // Load saved logs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("logs");
      if (stored) setLogs(JSON.parse(stored));
      setIsLoaded(true);
    }
  }, []);

  // Save logs whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("logs", JSON.stringify(logs));
    }
  }, [logs, isLoaded]);

  // Toggle play/pause
  const toggleStatus = (id: number) => {
    setLogs(prevLogs =>
      prevLogs.map(log => {
        if (log.id === id) {
          if (log.status === "idle" || log.status === "paused") {
            return { ...log, status: "running", startTime: Date.now() };
          } else if (log.status === "running") {
            const now = Date.now();
            const elapsed = log.startTime ? now - log.startTime : 0;
            return { 
              ...log, 
              status: "paused", 
              endTime: now, 
              duration: log.duration + elapsed,
              startTime: undefined
            };
          }
        }
        return log;
      })
    );
  };

  // ❌ Delete log
  const deleteLog = (id: number) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  // Update live timers
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prevLogs =>
        prevLogs.map(log => {
          if (log.status === "running" && log.startTime) {
            return { ...log }; // trigger re-render
          }
          return log;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add a new log
  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Log = {
      id: Date.now(),
      name: newLog.name,
      description: newLog.description,
      status: "idle",
      duration: 0
    };
    setLogs(prev => [...prev, newEntry]);
    setNewLog({ name: "", description: "" });
  };

  // Format ms → h:m:s
  const formatDuration = (log: Log) => {
    let total = log.duration;
    if (log.status === "running" && log.startTime) {
      total += Date.now() - log.startTime;
    }
    const totalSec = Math.floor(total / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`
      : `${m}:${s.toString().padStart(2,"0")}`;
  };

  // 🔄 Drag & Drop for logs
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(logs);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setLogs(reordered);
  };

  const calculateWeeklyTotalTime = (logs: Log[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0); // Start of the week

    return logs.reduce((total, log) => {
      const logStartTime = log.startTime ? new Date(log.startTime) : null;
      const logEndTime = log.endTime ? new Date(log.endTime) : null;

      if (logStartTime && logStartTime >= startOfWeek && logStartTime <= today) {
        total += log.duration;
      } else if (logEndTime && logEndTime >= startOfWeek && logEndTime <= today) {
        total += log.duration;
      } else if (log.status === "running" && log.startTime) {
        total += Date.now() - log.startTime;
      }

      return total;
    }, 0);
  };

  const weeklyTotalTime = calculateWeeklyTotalTime(logs);

  if (!isLoaded) return null;

  return (
    <>

      {/* Modal for Adding Log */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-[#F9D965]">
          <h3 className="font-bold text-lg mb-4">Add Log</h3>
          <form
            onSubmit={(e) => {
              addLog(e);
              (document.getElementById('my_modal_1') as HTMLDialogElement)?.close();
            }}
            className="grid grid-cols-1 gap-4"
          >
            <input
              type="text"
              maxLength={30}
              placeholder="Log name"
              value={newLog.name}
              onChange={(e) => setNewLog({ ...newLog, name: e.target.value })}
              required
              className="border p-2 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newLog.description}
              onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
              required
              className="border p-2 rounded-lg h-28 resize-none"
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
                Add Log
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Top Page */}

        <div className="bg-[#F9D965] p-2 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 ">
            <h1 className=" text-2xl font-semibold ">
              Today: {logs.length} Log(s) available
            </h1>
            <button
              onClick={() =>
                (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()
              }
              className="btn rounded-full bg-[#F3C623] px-3 sm:px-4 py-2 text-lg sm:text-xl hover:bg-[#FCFF58] border-none text-black shadow-md transition-colors duration-200"
            >
              <span className="text-xl font-bold">+</span>
              <span className="hidden sm:inline ml-1">Add Log</span>
            </button>
          </div>
        </div>


      {/* Body Page */}
        <div className="pt-4 ">
          <div className=" bg-[#F9D965] p-4  rounded-3xl text-black overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="logs">
                {(provided) => (
                  <table
                    className="table p-4 w-full"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <thead className="text-black">
                      <tr>
                        <th></th>
                        <th>Activity</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, index) => (
                        <Draggable key={log.id} draggableId={log.id.toString()} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td>{index + 1}</td>
                              <td>{log.name}</td>
                              <td>{log.description}</td>
                              <td>
                                <button
                                  onClick={() => toggleStatus(log.id)}
                                  className={`px-3 py-1 rounded-lg text-white ${
                                    log.status === "running"
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-green-500 hover:bg-green-600"
                                  }`}
                                >
                                  {log.status === "running" ? "Pause ⏸" : "Play ▶"}
                                </button>
                              </td>
                              <td>{formatDuration(log)}</td>
                              <td>
                                <button
                                  onClick={() => deleteLog(log.id)}
                                  className="text-red-600 font-bold hover:text-red-800"
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Categories placeholder */}
          <div className="flex mt-4 border-t-2 p-3">Categories (drag rows ↑)</div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold">Weekly Total Logged Time</h3>
          <p className="text-lg">{(weeklyTotalTime / 3600000).toFixed(2)} hours logged this week</p>
        </div>

    </>
  );
}
