import { retrieveForNotifications } from "../../src/controllers/register/retrieveForNotifications";
import { TeacherModel } from "../../src/models/Teacher";
import { RegistrationModel } from "../../src/models/Register";
import { StudentModel } from "../../src/models/Student";

jest.mock("../../src/models/Teacher");
jest.mock("../../src/models/Register");
jest.mock("../../src/models/Student");

describe("retrieveForNotifications", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        teacher: "teacher@example.com",
        notification: "Hello @student1@example.com",
        mentionedEmails: ["student1@example.com"]
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

  it("should return 400 if teacher email is missing", async () => {
    req.body.teacher = "";

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing teacher email" });
  });

  it("should return 404 if teacher is not found", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(null);

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Teacher not found" });
  });

  it("should return 404 if no valid recipients are found", async () => {
    const teacher = { id: 1, email: "teacher@example.com" };
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);
    RegistrationModel.prototype.getNonSuspendedStudentsByTeacherId = jest.fn().mockResolvedValue([]);
    StudentModel.prototype.getNonSuspendedStudentsByEmail = jest.fn().mockResolvedValue(null);

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No valid recipients found for the notification" });
  });

  it("should return 207 if some mentioned recipients are not found", async () => {
    const teacher = { id: 1, email: "teacher@example.com" };
    const student = { email: "student1@example.com" };
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);
    RegistrationModel.prototype.getNonSuspendedStudentsByTeacherId = jest.fn().mockResolvedValue([]);
    StudentModel.prototype.getNonSuspendedStudentsByEmail = jest.fn()
      .mockResolvedValueOnce(student)
      .mockResolvedValueOnce(null);

    req.body.mentionedEmails = ["student1@example.com", "student2@example.com"];

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(207);
    expect(res.json).toHaveBeenCalledWith({
      recipients: ["student1@example.com"],
      message: "Some mentioned recipients were not found: student2@example.com"
    });
  });

  it("should return 200 with valid recipients", async () => {
    const teacher = { id: 1, email: "teacher@example.com" };
    const student = { email: "student1@example.com" };
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);
    RegistrationModel.prototype.getNonSuspendedStudentsByTeacherId = jest.fn().mockResolvedValue([student]);
    StudentModel.prototype.getNonSuspendedStudentsByEmail = jest.fn().mockResolvedValue(student);

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ recipients: ["student1@example.com"] });
  });

  it("should return 500 for internal server error", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockImplementation(() => {
      throw new Error("Internal server error");
    });

    await retrieveForNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
