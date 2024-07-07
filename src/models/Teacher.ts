import { db } from "../db/db.ts";
import { teachers, SelectTeacher } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export class TeacherModel {
  getTeacherByEmail = async (email: string): Promise<SelectTeacher | null> => {
    const teacher = await db.select().from(teachers).where(eq(teachers.email, email)).limit(1);
    console.log({teacher: teacher})
    return teacher.length > 0 ? teacher[0] : null;
  }
}
