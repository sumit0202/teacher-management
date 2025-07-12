"use client";

import { useState } from "react";
import TeacherFormModal from "@/components/TeacherFormModal";
import { z } from "zod";
import { TeacherInput, teacherSchema } from "@/utils/validations";
import { Pencil, Trash2 } from "lucide-react";

type Teacher = z.infer<typeof teacherSchema>;
type Props = {
  teachers: Teacher[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState<TeacherInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherInput | null>(null);

  const handleAddOrUpdateTeacher = (data: TeacherInput) => {
    if (editIndex !== null) {
      // Edit Mode
      const updated = [...teachers];
      updated[editIndex] = data;
      setTeachers(updated);
      setEditIndex(null);
      setCurrentTeacher(null);
    } else {
      // Add Mode
      setTeachers((prev) => [...prev, data]);
    }
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Teacher
          </button>
        </header>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Teachers List</h2>
          {teachers.length === 0 ? (
            <p className="text-gray-500">No teachers added yet.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 text-sm font-semibold">Name</th>
                  <th className="p-3 text-sm font-semibold">Subject</th>
                  <th className="p-3 text-sm font-semibold">Experience</th>
                  <th className="p-3 text-sm font-semibold">Email</th>
                  <th className="p-3 text-black text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.subject}</td>
                    <td className="p-3">{t.experience} years</td>
                    <td className="p-3">{t.email}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => {
                          setEditIndex(i);
                          setCurrentTeacher(teachers[i]);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...teachers];
                          updated.splice(i, 1);
                          setTeachers(updated);
                        }}
                        className="text-red-600 hover:text-red-800"
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
      <TeacherFormModal
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          setEditIndex(null);
          setCurrentTeacher(null);
        }}
        onSubmit={handleAddOrUpdateTeacher}
        defaultValues={currentTeacher || undefined}
      />
    </main>
  );
}
