import { StudentModel } from "../../models/Student.ts";

export const toggleSuspendStudent = async (req, res) => {
  const { email }: { email: string } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const studentModel = new StudentModel();
    const student = await studentModel.getStudentByEmail(email);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent = await studentModel.updateStudentByEmail(email, { suspended: !student.suspended });
    return res.status(204).send();
  } catch (error) {
    console.error("Error updating student suspension status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
