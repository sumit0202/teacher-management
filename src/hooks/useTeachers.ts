import { useEffect, useState } from "react";
import { teacherSchema } from "@/utils/validations";
import { z } from "zod";

export type Teacher = z.infer<typeof teacherSchema>;

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("teachers");
    if (data) setTeachers(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const addTeacher = (teacher: Teacher) => setTeachers((prev) => [...prev, teacher]);

  const updateTeacher = (index: number, updated: Teacher) => {
    setTeachers((prev) => prev.map((t, i) => (i === index ? updated : t)));
  };

  const deleteTeacher = (index: number) => {
    setTeachers((prev) => prev.filter((_, i) => i !== index));
  };

  return { teachers, addTeacher, updateTeacher, deleteTeacher };
}
