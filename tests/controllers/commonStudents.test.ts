import { getCommonStudents } from "../../src/controllers/register/commonStudents";
import { TeacherModel } from "../../src/models/Teacher";
import { RegistrationModel } from "../../src/models/Register";

jest.mock("../../src/models/Teacher");
jest.mock("../../src/models/Register");

describe("getCommonStudents", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        teacher: ["teacher1@example.com", "teacher2@example.com"]
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

  it("should return 400 for invalid input", async () => {
    req.query.teacher = "";

    await getCommonStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  it("should return 404 if no teachers are found", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockResolvedValue(null);

    await getCommonStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No teachers found" });
  });

  it("should return common students for given teachers", async () => {
    const teacher1 = { id: 1, email: "teacher1@example.com" };
    const teacher2 = { id: 2, email: "teacher2@example.com" };
    const commonStudents = [{ email: "student1@example.com" }];

    TeacherModel.prototype.getTeacherByEmail = jest.fn()
      .mockResolvedValueOnce(teacher1)
      .mockResolvedValueOnce(teacher2);
    RegistrationModel.prototype.getCommonStudentsByTeacherId = jest.fn().mockResolvedValue(commonStudents);

    await getCommonStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ students: ["student1@example.com"] });
  });

  it("should return 500 for internal server error", async () => {
    TeacherModel.prototype.getTeacherByEmail = jest.fn().mockImplementation(() => {
      throw new Error("Internal server error");
    });

    await getCommonStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
