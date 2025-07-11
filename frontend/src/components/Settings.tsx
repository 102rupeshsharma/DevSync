import React, { useState, useEffect } from "react";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Replace this with real user data from backend in future
  const [profile, setProfile] = useState({
    username: "rupesh123",
    fullName: "Rupesh Kumar",
    bio: "Building fullstack apps 🚀",
  });

  useEffect(() => {
    // Set dark/light class on body/html root
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="w-full p-6 text-white">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-600 mb-6">
        {["profile", "account", "theme"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 text-sm font-medium capitalize transition duration-200 ${
              activeTab === tab ? "border-b-2 border-amber-400 text-amber-400" : "text-gray-400"
            }`}
          >
            {tab} Settings
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded outline-none focus:ring focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleProfileChange}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded outline-none focus:ring focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded outline-none focus:ring focus:ring-amber-400"
              rows={3}
            />
          </div>
          <button
            onClick={() => alert("Save profile API will be added later")}
            className="mt-2 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Account Management */}
      {activeTab === "account" && (
        <div className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold">Account Management</h2>
          <button
            onClick={() => alert("Delete account logic will be added")}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full"
          >
            Delete Account
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload(); // You can route to login instead
            }}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded w-full"
          >
            Logout
          </button>
        </div>
      )}

      {/* Theme Customization */}
      {activeTab === "theme" && (
        <div className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold">Theme Customization</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
