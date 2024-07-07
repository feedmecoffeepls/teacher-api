ALTER TABLE "students" ADD CONSTRAINT "students_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_email_unique" UNIQUE("email");