"use client";

import { useEffect, useState } from "react";

interface Teacher {
  name: string;
  subject: string;
  experience: number;
  email: string;
}

export default function DashboardCards() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("teachers");
    if (data) setTeachers(JSON.parse(data));
  }, []);

  const totalTeachers = teachers.length;
  const subjects = [...new Set(teachers.map((t) => t.subject))];
  const avgExp =
    teachers.reduce((acc, t) => acc + t.experience, 0) / (totalTeachers || 1);

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4 text-black">
      <div className="bg-blue-200 p-4 rounded-xl shadow">
        <h3 className="text-sm text-gray-500">Total Teachers</h3>
        <p className="text-2xl font-bold">{totalTeachers}</p>
      </div>
      <div className="bg-green-200 p-4 rounded-xl shadow">
        <h3 className="text-sm text-gray-500">Subjects</h3>
        <p className="text-2xl font-bold">{subjects.length}</p>
      </div>
      <div className="bg-yellow-200 p-4 rounded-xl shadow">
        <h3 className="text-sm text-gray-500">Avg Experience</h3>
        <p className="text-2xl font-bold">{avgExp.toFixed(1)} yrs</p>
      </div>
    </div>
  );
}
