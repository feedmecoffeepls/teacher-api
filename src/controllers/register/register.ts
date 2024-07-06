import { RegistrationModel } from "../../models/registration.ts";
import { TeacherModel } from "../../models/teacher.ts";
import { StudentModel } from "../../models/student.ts";

export const registerStudent = async (req, res) => {
  const { teacher, students }: { teacher: string, students: string[] } = req.body;

  console.log(req.body);

  if (!teacher || !students || !Array.isArray(students)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const teacherModel = new TeacherModel();
    const studentModel = new StudentModel();
    const registrationModel = new RegistrationModel();

    const teacherObj = await teacherModel.getTeacherByEmail(teacher);
    if (!teacherObj) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    for (const studentEmail of students) {
      let studentObj = await studentModel.getStudentByEmail(studentEmail);
      if (!studentObj) {
        studentObj = await studentModel.createStudent({ email: studentEmail });
      }
      await registrationModel.createRegistration({ teacherId: teacherObj.id, studentId: studentObj.id });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error registering students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
