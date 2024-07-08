import { toggleSuspendStudent } from "../../src/controllers/student/suspendStudent";
import { StudentModel } from "../../src/models/Student";

jest.mock("../../src/models/Student");

describe("toggleSuspendStudent", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@student.com"
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if student is not found", async () => {
    StudentModel.prototype.getStudentByEmail = jest.fn().mockResolvedValue(null);

    await toggleSuspendStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Student not found" });
  });

  it("should update student suspension status and return 204", async () => {
    const student = { email: "test@student.com", suspended: false };
    const updatedStudent = { ...student, suspended: true };

    StudentModel.prototype.getStudentByEmail = jest.fn().mockResolvedValue(student);
    StudentModel.prototype.updateStudentByEmail = jest.fn().mockResolvedValue(updatedStudent);

    await toggleSuspendStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should return 500 if there is an internal server error", async () => {
    StudentModel.prototype.getStudentByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

    await toggleSuspendStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
