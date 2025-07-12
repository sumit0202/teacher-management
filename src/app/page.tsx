"use client";

import { useState } from "react";
import { z } from "zod";
import { teacherSchema } from "@/utils/validations";
import TeacherFormModal from "@/components/TeacherFormModal";
import Sidebar from "@/components/Sidebar";
import DashboardCards from "@/components/DashboardCards";
import { Pencil, Trash2 } from "lucide-react";

type TeacherInput = z.infer<typeof teacherSchema>;

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherInput[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherInput | null>(
    null
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Teacher Management Dashboard
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
            >
              + Add Teacher
            </button>
          </header>

          {/* Dashboard Summary Cards */}
          <DashboardCards teachers={teachers} />

          {/* Teachers Table */}
          <section className="bg-white p-6 rounded-lg shadow mt-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Teachers List
            </h2>
            {teachers.length === 0 ? (
              <p className="text-gray-900">Oops! No teachers added yet.</p>
            ) : (
              <table className="w-full table-auto border-collapse border-dashed border-gray-300">
                <thead>
                  <tr className="bg-gray-300 text-left">
                    <th className="p-3 text-black text-sm font-semibold">
                      Name
                    </th>
                    <th className="p-3 text-black text-sm font-semibold">
                      Subject
                    </th>
                    <th className="p-3 text-black text-sm font-semibold">
                      Experience
                    </th>
                    <th className="p-3 text-black text-sm font-semibold">
                      Email
                    </th>
                    <th className="p-3 text-black text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b">
                      <td className="p-3 text-black font-semibold">{t.name}</td>
                      <td className="p-3 text-black font-semibold">
                        {t.subject}
                      </td>
                      <td className="p-3 text-black font-semibold">
                        {t.experience} years
                      </td>
                      <td className="p-3 text-black font-semibold">
                        {t.email}
                      </td>
                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => {
                            setEditIndex(index);
                            setCurrentTeacher(teachers[index]);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const updated = [...teachers];
                            updated.splice(index, 1);
                            setTeachers(updated);
                          }}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        {/* Modal */}
        <TeacherFormModal
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            setEditIndex(null);
            setCurrentTeacher(null);
          }}
          onSubmit={(data) => {
            if (editIndex !== null) {
              const updated = [...teachers];
              updated[editIndex] = data;
              setTeachers(updated);
              setEditIndex(null);
              setCurrentTeacher(null);
            } else {
              setTeachers((prev) => [...prev, data]);
            }
            setIsModalOpen(false);
          }}
          defaultValues={currentTeacher || undefined}
        />
      </main>
    </div>
  );
};

export default HomePage;
