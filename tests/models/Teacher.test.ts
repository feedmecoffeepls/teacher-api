import { TeacherModel } from "../../src/models/Teacher.ts";

jest.mock("../../src/models/Teacher.ts");

describe("TeacherModel", () => {
  let teacherModel;

  beforeEach(() => {
    teacherModel = new TeacherModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTeacherByEmail", () => {
    it("should return teacher if found", async () => {
      const teacher = { id: 1, email: "teacher@example.com" };
      teacherModel.getTeacherByEmail = jest.fn().mockResolvedValue(teacher);

      const result = await teacherModel.getTeacherByEmail("teacher@example.com");

      expect(result).toEqual(teacher);
      expect(teacherModel.getTeacherByEmail).toHaveBeenCalledWith("teacher@example.com");
    });

    it("should return null if teacher is not found", async () => {
      teacherModel.getTeacherByEmail = jest.fn().mockResolvedValue(null);

      const result = await teacherModel.getTeacherByEmail("nonexistent@example.com");

      expect(result).toBeNull();
      expect(teacherModel.getTeacherByEmail).toHaveBeenCalledWith("nonexistent@example.com");
    });

    it("should throw an error if there is an internal server error", async () => {
      teacherModel.getTeacherByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

      await expect(teacherModel.getTeacherByEmail("teacher@example.com")).rejects.toThrow("Internal server error");
      expect(teacherModel.getTeacherByEmail).toHaveBeenCalledWith("teacher@example.com");
    });
  });
});
