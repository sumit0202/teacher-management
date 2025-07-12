import { Teacher } from '@/types/teacher';

interface Props {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{teacher.name}</h3>
      <p>{teacher.subject}</p>
      <p>{teacher.experience} years experience</p>
      <p className="text-sm text-black-500">{teacher.email}</p>
    </div>
  );
}
