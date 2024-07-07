import { db } from "../db/db.ts";
import { registrations, students, InsertRegistration, SelectRegistration, SelectStudent } from "../db/schema.ts";
import { eq, inArray, and } from "drizzle-orm";

export class RegistrationModel {
  createRegistration = async (data: InsertRegistration): Promise<SelectRegistration> => {
    const [newRegistration] = await db.insert(registrations).values(data).returning();
    return newRegistration;
  }

  getCommonStudentsByTeacherId = async (teacherIds: number[]): Promise<SelectStudent[]> => {
    if (teacherIds.length === 0) {
      return [];
    }

    const registrationRecords = await db.select()
      .from(registrations)
      .leftJoin(students, eq(registrations.studentId, students.id))
      .where(inArray(registrations.teacherId, teacherIds));

    const studentCountMap = new Map<number, { student: SelectStudent, count: number }>();

    registrationRecords.forEach(record => {
      const studentId = record.students.id;
      if (studentCountMap.has(studentId)) {
        studentCountMap.get(studentId)!.count += 1;
      } else {
        studentCountMap.set(studentId, { student: record.students, count: 1 });
      }
    });

    const commonStudents = Array.from(studentCountMap.values())
      .filter(entry => entry.count === teacherIds.length)
      .map(entry => entry.student);

    return commonStudents;
  }
}
