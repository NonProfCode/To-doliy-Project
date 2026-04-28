'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Log {
  id: number;
  name: string;
  description: string;
  startTime?: number;
  endTime?: number;
  duration: number;
  status: "idle" | "running" | "paused" | "completed";
}

export default function Short_Cut_Card() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prevLogs) =>
        prevLogs.map((log) => {
          if (log.status === "running" && log.startTime) {
            return { ...log }; // Trigger re-render
          }
          return log;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#F9D965] p-4 rounded-2xl shadow-lg shadow-black/20">
      <h2 className="text-2xl font-bold mb-4">Short-Cut Logs</h2>

      {logs.length === 0 ? (
        <p className="text-gray-600">No logs available 🎉</p>
      ) : (
        <div className="justify-between">
          <ul>
            {logs.slice(0, 5).map((log) => (
              <li key={log.id} className="flex items-center justify-between mb-2 ">
                <span>{log.name}</span>
                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white">
                    {formatDuration(log)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <Link href="/dashboard/Time-Logger-Page" className="btn border-[#F9D965] bg-[#FFB22C] shadow-[#F9D965] shadow-2xl text-black mt-2 rounded-2xl border-2 hover:bg-[#ffe9b3] transition-colors duration-200">
              View All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}