import { TeacherModel } from "../../models/Teacher.ts";
import { RegistrationModel } from "../../models/Register.ts";
import { StudentModel } from "../../models/Student.ts";

export const retrieveForNotifications = async (req, res) => {
  const { teacher: teacherEmail, notification, mentionedEmails = [] }: { teacher: string, notification: string, mentionedEmails?: string[] } = req.body;

  if (!teacherEmail) {
    return res.status(400).json({ message: "Missing teacher email" });
  }

  try {
    const teacherModel = new TeacherModel();
    const teacher = await teacherModel.getTeacherByEmail(teacherEmail);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const registrationModel = new RegistrationModel();
    const students = await registrationModel.getNonSuspendedStudentsByTeacherId(teacher.id);

    const studentModel = new StudentModel();
    const mentionedStudentRecords = [];
    const missingMentionedStudent = [];

    for (const email of mentionedEmails) {
      const student = await studentModel.getNonSuspendedStudentsByEmail(email);
      if (student) {
        mentionedStudentRecords.push(student);
      } else {
        missingMentionedStudent.push(email)
      }
    }

    const validNotificationRecipients = [
      ...new Set([
        ...students.map(student => student.email),
        ...mentionedStudentRecords.map(student => student.email)
      ])
    ];

    if (validNotificationRecipients.length === 0) {
      return res.status(404).json({ message: "No valid recipients found for the notification" });
    }

    if (missingMentionedStudent.length !== 0 && validNotificationRecipients.length !== 0) {
      return res.status(207).json({
        recipients: validNotificationRecipients,
        message: `Some mentioned recipients were not found: ${missingMentionedStudent.join(", ")}`
      });
    }

    return res.status(200).json({ recipients: validNotificationRecipients });
  } catch (error) {
    console.error("Error retrieving students for notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};  
