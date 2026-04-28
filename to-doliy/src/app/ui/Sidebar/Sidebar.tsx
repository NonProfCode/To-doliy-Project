"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// logos
import { IoMdHome, IoIosStats, IoMdSettings } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { CiCalendar, CiMenuKebab } from "react-icons/ci";
import { MdSchedule } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

export default function Sidebar() {
    const [userProfile, setUserProfile] = useState({
        name: "User",
        description: "This is your profile",
        avatar: "/api/placeholder/150/150",
    });

    const menuItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <IoMdHome/>,
    },
    {
        title: "To-do list",
        path: "/dashboard/Task-Management-Page",
        icon: <LuListTodo />,
    },
    {
        title: "Time Logger",
        path: "/dashboard/Time-Logger-Page",
        icon: <CiCalendar />,
    },
    {
        title: "Schedules",
        path: "/dashboard/Scheduler-Page",
        icon: <MdSchedule />,
    },
    {
        title: "Mood & Journaling",
        path: "/dashboard/Mood-Page",
        icon: <FaHeart />,
    },
    {
        title: "Statistics",
        path: "/dashboard/Statistics",
        icon: <IoIosStats />,
    },
    {
        title: "Settings",
        path: "/dashboard/Settings-Page",
        icon: <IoMdSettings />,
    },
];

    useEffect(() => {
        const loadProfile = () => {
            const stored = localStorage.getItem("userProfile");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setUserProfile({
                        name: parsed.name || "User",
                        description: parsed.description || parsed.about || "This is your profile",
                        avatar: parsed.avatar || "/api/placeholder/150/150",
                    });
                } catch (error) {
                    console.warn("Unable to parse saved user profile", error);
                }
            }
        };

        loadProfile();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "userProfile") {
                loadProfile();
            }
        };

        const handleProfileUpdated = () => {
            loadProfile();
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("userProfileUpdated", handleProfileUpdated);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("userProfileUpdated", handleProfileUpdated);
        };
    }, []);

    return (
        <div className=" bg-[#F9D965] rounded-3xl h-full flex flex-col justify-between shadow-lg shadow-black/20">
            <p className="p-4 mb-4 font-bold text-3xl text-shadow-lg shadow-black">To-doliy:</p>
            {/* Menu Items */}
            <div className="flex flex-col gap-1 font-extralight pl-4 text-xl">
            {menuItems.map((item, index) => (
                <Link href={item.path} key={index} className="flex items-center text-black gap-2 p-2 rounded-lg hover:bg-[#ffe9b3] transition-colors duration-200">
                {item.icon}
                <span>{item.title}</span>
                </Link>
            ))}
            </div>

            {/* User Profile Section */}
            <div className="mt-auto">
                <div className="p-2">
                    <div className="rounded-4xl bg-[#FFB22C] p-2 mt-4 flex items-center gap-3">
                    <Link href="/dashboard/User_Profile" className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                            <img
                                src={userProfile.avatar}
                                alt={userProfile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-left">
                            <p className="text-base font-semibold">{userProfile.name}</p>                 
                            {/* <p className="text-sm text-black/70">{userProfile.description}</p> For description*/}
                        </div>
                    </Link>
                    <Link href="/dashboard/User_Profile" className="text-black/70 hover:text-gray-700 transition-colors duration-200">
                        <CiMenuKebab className="text-2xl" />
                    </Link>
                </div>
                </div>
            </div>
        </div>
    );
}