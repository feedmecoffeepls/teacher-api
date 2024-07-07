import { registerStudent } from "../../src/controllers/register/register";
import { TeacherModel } from "../../src/models/Teacher";
import { StudentModel } from "../../src/models/Student";
import { RegistrationModel } from "../../src/models/Register";

jest.mock("../../src/models/Teacher");
jest.mock("../../src/models/Student");
jest.mock("../../src/models/Register");

describe("registerStudent", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"]
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

  it("should return 404 if teacher is not found", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(null);

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Teacher not found" });
  });

  it("should create new students and register them if they do not exist", async () => {
    const teacher = { id: 1, email: "teacher@example.com" };
    const student1 = { id: 1, email: "student1@example.com" };
    const student2 = { id: 2, email: "student2@example.com" };

    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);
    StudentModel.prototype.getStudentByEmail = jest.fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    StudentModel.prototype.createStudent = jest.fn()
      .mockResolvedValueOnce(student1)
      .mockResolvedValueOnce(student2);
    RegistrationModel.prototype.createRegistration = jest.fn().mockResolvedValue({});

    await registerStudent(req, res);

    expect(StudentModel.prototype.createStudent).toHaveBeenCalledTimes(2);
    expect(RegistrationModel.prototype.createRegistration).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should register existing students", async () => {
    const teacher = { id: 1, email: "teacher@example.com" };
    const student1 = { id: 1, email: "student1@example.com" };
    const student2 = { id: 2, email: "student2@example.com" };

    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);
    StudentModel.prototype.getStudentByEmail = jest.fn()
      .mockResolvedValueOnce(student1)
      .mockResolvedValueOnce(student2);
    RegistrationModel.prototype.createRegistration = jest.fn().mockResolvedValue({});

    await registerStudent(req, res);

    expect(StudentModel.prototype.createStudent).not.toHaveBeenCalled();
    expect(RegistrationModel.prototype.createRegistration).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return 500 if there is an internal server error", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
