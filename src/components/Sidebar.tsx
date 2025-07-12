"use client";

import { useState } from "react";
import { FiUsers, FiSettings, FiHome, FiMenu } from "react-icons/fi";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", icon: <FiHome />, href: "#dashboard" },
  { name: "Teachers", icon: <FiUsers />, href: "#teachers" },
  { name: "Settings", icon: <FiSettings />, href: "#settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-wide text-white">Teacher Panel</h2>
        )}
        <button
          className="text-white hover:text-blue-300 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6 flex flex-col gap-2 px-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom Footer (optional) */}
      <div className="absolute bottom-4 w-full px-4 text-xs text-blue-300 text-center">
        {!collapsed && <p>© 2025 TeacherApp</p>}
      </div>
    </aside>
  );
}
