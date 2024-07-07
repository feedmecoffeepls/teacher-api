import { boolean, integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id, {onDelete: 'cascade'}).notNull(),
  teacherId: integer("teacher_id").references(() => teachers.id, {onDelete: 'cascade'}).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.studentId, t.teacherId)
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  teacher: one(teachers, {
    fields: [registrations.teacherId],
    references: [teachers.id],
  }),
  student: one(students, {
    fields: [registrations.studentId],
    references: [students.id],
  }),
}));

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  email: text('email').notNull(),
}, (t) => ({
  unq: unique().on(t.email)
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  registrations: many(registrations),
}));

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: text('email').notNull(),
  suspended: boolean('suspended').notNull().default(false),
}, (t) => ({
  unq: unique().on(t.email)
}));

export const studentRelations = relations(students, ({ many }) => ({
  registrations: many(registrations),
}));

 

export type InsertRegistration = typeof registrations.$inferInsert;
export type SelectRegistration = typeof registrations.$inferSelect;

export type InsertTeacher = typeof teachers.$inferInsert;
export type SelectTeacher = typeof teachers.$inferSelect;

export type InsertStudent = typeof students.$inferInsert;
export type SelectStudent = typeof students.$inferSelect;
