import { RegistrationModel } from "../../models/registration";

export const registerStudent = async (req, res) => {
  const { teacher, students }: { teacher: number, students: number[] } = req.body;

  console.log(req.body);

  if (!teacher || !students || !Array.isArray(students)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const registrationModel = new RegistrationModel();
    for (const student of students) {
      await registrationModel.createRegistration({ teacherId: teacher, studentId: student });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error registering students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
