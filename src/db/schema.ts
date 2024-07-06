import { boolean, integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id, {onDelete: 'cascade'}).notNull(),
  teacherId: integer("teacher_id").references(() => teachers.id, {onDelete: 'cascade'}).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.studentId, t.teacherId)
}));

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  email: text('email').notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: text('email').notNull(),
  suspended: boolean('suspended').notNull().default(false),
});
 

export type InsertRegistration = typeof registrations.$inferInsert;
export type SelectRegistration = typeof registrations.$inferSelect;

export type InsertTeacher = typeof teachers.$inferInsert;
export type SelectTeacher = typeof teachers.$inferSelect;

export type InsertStudent = typeof students.$inferInsert;
export type SelectStudent = typeof students.$inferSelect;
