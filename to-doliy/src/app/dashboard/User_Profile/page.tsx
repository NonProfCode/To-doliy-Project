"use client";
import { useEffect, useRef, useState } from "react";

export default function Settings() {
    const [name, setName] = useState("John Doe");
    const [about, setAbout] = useState("Hello! This is my profile.");
    const [avatar, setAvatar] = useState("/api/placeholder/150/150");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setName(parsed.name || "John Doe");
                setAbout(parsed.about || "Hello! This is my profile.");
                setAvatar(parsed.avatar || "/api/placeholder/150/150");
            } catch (error) {
                console.warn("Unable to parse saved user profile", error);
            }
        }
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setAvatar(result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file");
        }
    };

    const handleSave = () => {
        const profile = { name, about, description: about, avatar };
        localStorage.setItem("userProfile", JSON.stringify(profile));
        window.dispatchEvent(new Event("userProfileUpdated"));
        alert("Profile saved!");
    };

    const handleReset = () => {
        setName("John Doe");
        setAbout("Hello! This is my profile.");
        setAvatar("/api/placeholder/150/150");
    };


    return (
        <div className="bg-[#F9D965] p-6 rounded-2xl ">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mb-2 cursor-pointer hover:opacity-80 transition" onClick={() => fileInputRef.current?.click()}>
                    <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Name */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-400"
                />
            </div>

            {/* About */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">About</label>
                <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-400 resize-none"
                />
            </div>
 <div className="flex">{/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
                Save Profile
            </button>
            <button
                onClick={handleReset}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
                Reset Profile
            </button></div>
            
        </div>
    );
}