import { RegistrationModel } from "../../models/Register.ts";
import { TeacherModel } from "../../models/Teacher.ts";
import { StudentModel } from "../../models/Student.ts";

export const registerStudent = async (req, res) => {
  const { teacher, students }: { teacher: string, students: string[] } = req.body;

  try {
    const teacherModel = new TeacherModel();
    const studentModel = new StudentModel();
    const registrationModel = new RegistrationModel();

    const teacherObj = await teacherModel.getTeacherByEmail(teacher);
    if (!teacherObj) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const skippedRegistrations = [];

    for (const studentEmail of students) {
      let studentObj = await studentModel.getStudentByEmail(studentEmail);
      if (!studentObj) {
        studentObj = await studentModel.createStudent({ email: studentEmail });
      }
      try {
        await registrationModel.createRegistration({ teacherId: teacherObj.id, studentId: studentObj.id });
      } catch (error) {
        if (error.code === '23505') {
          console.log(`Registration already exists for student ${studentObj.email} and teacher ${teacherObj.email}`);
          skippedRegistrations.push(studentObj.email);
        } else {
          throw error;
        }
      }
    }

    if (skippedRegistrations.length > 0) {
      return res.status(207).json({ message: "Some registrations were skipped:", skippedRegistrations });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error registering students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
