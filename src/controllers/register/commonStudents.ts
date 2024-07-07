import { TeacherModel } from "../../models/Teacher.ts";
import { RegistrationModel } from "../../models/Register.ts";

export const getCommonStudents = async (req, res) => {
  const { teacher: teacherEmails }: { teacher: string[] } = req.query;


  if (!teacherEmails || !Array.isArray(teacherEmails) || teacherEmails.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const teacherModelInstance = new TeacherModel();
    const teacherIdList = [];

    for (const email of teacherEmails) {
      const teacherRecord = await teacherModelInstance.getTeacherByEmail(email);
      if (teacherRecord) {
        teacherIdList.push(teacherRecord.id);
      }
    }

    if (teacherIdList.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    const registrationModelInstance = new RegistrationModel();
    const commonStudents = await registrationModelInstance.getCommonStudentsByTeacherId(teacherIdList);
    const studentEmails = commonStudents.map(student => student.email);

    return res.status(200).json({ students: studentEmails });
  } catch (error) {
    console.error("Error retrieving common students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
