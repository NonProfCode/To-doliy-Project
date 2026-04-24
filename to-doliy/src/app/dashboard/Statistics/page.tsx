'use client';

import { useEffect, useState } from "react";

interface Task {
  id: number;
  name: string;
  isCompleted: boolean;
  expDate: string;
}

interface Log {
  endTime: any;
  startTime: any;
  id: number;
  name: string;
  duration: number;
  status: "idle" | "running" | "paused" | "completed";
}

interface JournalEntry {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  dateCreated: string;
  Mood: '1' | '2' | '3' | '4' | '5';
}

export default function Statistics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [taskProgress, setTaskProgress] = useState<number>(0);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedSchedules = localStorage.getItem("schedulerTasks");
    const storedJournals = localStorage.getItem("journals");

    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      setTasks(parsedTasks);
      const completedTasks = parsedTasks.filter((task: Task) => task.isCompleted).length;
      const progress = parsedTasks.length > 0 ? Math.round((completedTasks / parsedTasks.length) * 100) : 0;
      setTaskProgress(progress);
    }

 

    if (storedJournals) {
      const parsedJournals = JSON.parse(storedJournals);
      setJournals(parsedJournals);
    }

    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs);
      setLogs(parsedLogs);
    }
  }, []);

  useEffect(() => {
    const progress = calculateWeeklyProgress(tasks, (task) => task.isCompleted);
    setTaskProgress(progress);
  }, [tasks]);

  const calculateWeeklyProgress = (items: any[], condition: (item: any) => boolean) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weeklyItems = items.filter((item) => {
      const itemDate = new Date(item.expDate || item.dateCreated);
      return itemDate >= startOfWeek && itemDate <= today;
    });

    const total = weeklyItems.length;
    const completed = weeklyItems.filter(condition).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const calculateTotalWeeklyTime = (logs: Log[]) => {
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

  const totalWeeklyTime = calculateTotalWeeklyTime(logs);

  return (
    <div className="bg-[#F9D965] p-6 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6">Your Weekly Progress</h2>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Task Completion</h3>
        <div className="w-full bg-gray-300 rounded-full h-6">
          <div
            className="bg-green-500 h-6 rounded-full"
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
        <p className="text-lg mt-2">{taskProgress}% of tasks completed</p>
      </div>

     

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Journal Entries</h3>
        <p className="text-lg">{journals.length} journal entries created</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Weekly Total Logged Time</h3>
        <p className="text-lg">{(totalWeeklyTime / 3600000).toFixed(2)} hours logged this week</p>
      </div>
    </div>
  );
}