import { db } from "../db/db.ts";
import { students, InsertStudent, SelectStudent } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";

export class StudentModel {
  createStudent = async (data: InsertStudent): Promise<SelectStudent> => {
    const [newStudent] = await db.insert(students).values(data).returning();
    return newStudent;
  }
  getStudentByEmail = async (email: string): Promise<SelectStudent | null> => {
    const student = await db.select().from(students).where(eq(students.email, email)).limit(1);
    return student.length > 0 ? student[0] : null;
  }
  getNonSuspendedStudentsByEmail = async (email: string): Promise<SelectStudent | null> => {
    const student = await db.select().from(students).where(and(eq(students.email, email), eq(students.suspended, false))).limit(1);
    return student.length > 0 ? student[0] : null;
  }
  updateStudentByEmail = async (email: string, data: Partial<InsertStudent>): Promise<SelectStudent | null> => {
    const [updatedStudent] = await db.update(students).set(data).where(eq(students.email, email)).returning();
    return updatedStudent || null;
  }
}
