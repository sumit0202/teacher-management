import { z } from "zod";

export const teacherSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  subject: z.string().min(1, "Subject is required"),
  experience: z.number().min(0, "Experience must be a number"),
  email: z.string().email("Invalid email"),
});

export type TeacherInput = z.infer<typeof teacherSchema>;
