


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
  isCompleted: boolean;
  expDate: string;
}

interface JournalEntry {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  dateCreated: string;
  Mood: '1' | '2' | '3' | '4' | '5';
}

export default function Statistics_Card() {
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [scheduleProgress, setScheduleProgress] = useState<number>(0);
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const loadData = () => {
      const storedTasks = localStorage.getItem("tasks");
      const storedSchedules = localStorage.getItem("schedulerTasks");
      const storedJournals = localStorage.getItem("journals");

      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const completedTasks = parsedTasks.filter((task: Task) => task.isCompleted).length;
        const progress = parsedTasks.length > 0 ? Math.round((completedTasks / parsedTasks.length) * 100) : 0;
        setTaskProgress(progress);
      }

      if (storedSchedules) {
        const parsedSchedules = JSON.parse(storedSchedules);
        const completedSchedules = parsedSchedules.filter((schedule: Task) => schedule.isCompleted).length;
        const progress = parsedSchedules.length > 0 ? Math.round((completedSchedules / parsedSchedules.length) * 100) : 0;
        setScheduleProgress(progress);
      }

      if (storedJournals) {
        const parsedJournals = JSON.parse(storedJournals);
        setJournals(parsedJournals);
      }
    };

    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "tasks" || event.key === "schedulerTasks" || event.key === "journals") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="bg-[#F9D965] p-4 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>

      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">Tasks</h3>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1">{taskProgress}% completed</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Journals</h3>
        <p className="text-xs mt-1">{journals.length} entries</p>
      </div>

      <div className="flex justify-center">
        <Link href="/dashboard/Statistics" className="btn border-[#F9D965] bg-[#FFB22C] shadow-[#F9D965] shadow-2xl text-black mt-2 rounded-2xl border-2 hover:bg-[#ffe9b3] transition-colors duration-200">
          View All
        </Link>
      </div>
    </div>
  );
}