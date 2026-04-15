"use client";

import { useState, useEffect } from "react";

type TimeFormat = "12h" | "24h";

interface SettingsData {
  darkMode: boolean;
  timeFormat: TimeFormat;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    darkMode: false,
    timeFormat: "12h",
  });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    // Load logs for display
    const savedLogs = localStorage.getItem("app-logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("app-settings", JSON.stringify(updated));
  };

  const exportData = (format: "json" | "csv") => {
    const data = logs.length > 0 ? logs : [];
    let content: string;
    let filename: string;
    let type: string;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      filename = "todoliy-logs.json";
      type = "application/json";
    } else {
      content = "timestamp,log\n" + data.map((log) => `"${log}"`).join("\n");
      filename = "todoliy-logs.csv";
      type = "text/csv";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllLogs = () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      localStorage.removeItem("app-logs");
      setLogs([]);
    }
  };

  return (
    <div
      className=" p-6 rounded-2xl min-h-screen"
      style={{ backgroundColor: settings.darkMode ? "#1F2937" : "#F9D965" }}
    >
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: settings.darkMode ? "#F9FAFB" : "#111827" }}
      >
        Settings
      </h1>

      <div className="max-w-md space-y-6">
        {/* Dark Mode */}
        <div
          className="p-4 rounded-lg shadow-sm border" 
          style={{
            backgroundColor: settings.darkMode ? "#374151" : "#F3C623",
            borderColor: settings.darkMode ? "#4B5563" : "#F3C623",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-medium"
              style={{ color: settings.darkMode ? "#F9FAFB" : "#111827" }}
            >
              Dark Mode
            </span>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className="w-12 h-6 rounded-full transition-colors relative"
              style={{
                backgroundColor: settings.darkMode ? "#FACC15" : "#D1D5DB",
              }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                style={{
                  left: settings.darkMode ? "28px" : "4px",
                }}
              />
            </button>
          </div>
        </div>

        {/* Time Format */}
        <div
          className="p-4 rounded-lg shadow-sm border"
          style={{
            backgroundColor: settings.darkMode ? "#374151" : "#F3C623",
            borderColor: settings.darkMode ? "#4B5563" : "#F3C623",
          }}
        >
          <span
            className="font-medium block mb-3"
            style={{ color: settings.darkMode ? "#F9FAFB" : "#111827" }}
          >
            Time Format
          </span>
          <div className="flex gap-2">
            {(["12h", "24h"] as TimeFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => updateSettings({ timeFormat: format })}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor:
                    settings.timeFormat === format
                      ? "#FACC15"
                      : settings.darkMode
                        ? "#4B5563"
                        : "#E5E7EB",
                  color:
                    settings.timeFormat === format
                      ? "#111827"
                      : settings.darkMode
                        ? "#F9FAFB"
                        : "#374151",
                }}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Export Data */}
        <div
          className="p-4 rounded-lg shadow-sm border"
          style={{
            backgroundColor: settings.darkMode ? "#374151" : "#F3C623",
            borderColor: settings.darkMode ? "#4B5563" : "#F3C623",
          }}
        >
          <span
            className="font-medium block mb-3"
            style={{ color: settings.darkMode ? "#F9FAFB" : "#111827" }}
          >
            Export Data
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => exportData("json")}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: "#FACC15",
                color: "#111827",
              }}
            >
              Export JSON
            </button>
            <button
              onClick={() => exportData("csv")}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: "#FACC15",
                color: "#111827",
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Clear All Logs */}
        <div
          className="p-4 rounded-lg shadow-sm border"
          style={{
            backgroundColor: settings.darkMode ? "#374151" : "#F3C623",
            borderColor: settings.darkMode ? "#4B5563" : "#F3C623",
          }}
        >
          <span
            className="font-medium block mb-3"
            style={{ color: settings.darkMode ? "#F9FAFB" : "#111827" }}
          >
            Clear Data
          </span>
          <button
            onClick={clearAllLogs}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
            }}
          >
            Clear All Logs
          </button>
        </div>
      </div>
    </div>
  );
}
