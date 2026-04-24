"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  description: string;
  avatar: string;
};



export default function WelcomeCard() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "User",
    description: "This is a description",
    avatar: "/api/placeholder/150/150",
  });


  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserProfile({
            name: parsed.name || "User",
            description: parsed.description || parsed.about || "This is a description",
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

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userProfileUpdated", loadProfile);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userProfileUpdated", loadProfile);
    };
  }, []);

  return (
    <div className="bg-[#F9D965] p-6 rounded-3xl text-black shadow-lg shadow-black/10">
      <div className="grid gap-5 md:grid-cols-[1.8fr_1.2fr] items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-black/10">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-3xl font-bold leading-tight">Welcome back, {userProfile.name}</p>
              <p className="text-sm text-slate-800/80 mt-1">{userProfile.description}</p>
            </div>
            
      
          </div>

    </div>
    </div>
    </div>
  );
}