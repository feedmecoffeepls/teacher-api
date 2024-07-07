import { StudentModel } from "../../src/models/Student";

jest.mock("../../src/models/Student");

describe("StudentModel", () => {
  let studentModel;

  beforeEach(() => {
    studentModel = new StudentModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should create a new student", async () => {
      const newStudent = { id: 1, email: "new@student.com" };
      studentModel.createStudent = jest.fn().mockResolvedValue(newStudent);

      const result = await studentModel.createStudent(newStudent);

      expect(result).toEqual(newStudent);
      expect(studentModel.createStudent).toHaveBeenCalledWith(newStudent);
    });
  });

  describe("getStudentByEmail", () => {
    it("should return student if found", async () => {
      const student = { id: 1, email: "student@example.com" };
      studentModel.getStudentByEmail = jest.fn().mockResolvedValue(student);

      const result = await studentModel.getStudentByEmail("student@example.com");

      expect(result).toEqual(student);
      expect(studentModel.getStudentByEmail).toHaveBeenCalledWith("student@example.com");
    });

    it("should return null if student is not found", async () => {
      studentModel.getStudentByEmail = jest.fn().mockResolvedValue(null);

      const result = await studentModel.getStudentByEmail("nonexistent@example.com");

      expect(result).toBeNull();
      expect(studentModel.getStudentByEmail).toHaveBeenCalledWith("nonexistent@example.com");
    });

    it("should throw an error if there is an internal server error", async () => {
      studentModel.getStudentByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

      await expect(studentModel.getStudentByEmail("student@example.com")).rejects.toThrow("Internal server error");
      expect(studentModel.getStudentByEmail).toHaveBeenCalledWith("student@example.com");
    });
  });

  describe("getNonSuspendedStudentsByEmail", () => {
    it("should return non-suspended student if found", async () => {
      const student = { id: 1, email: "student@example.com", suspended: false };
      studentModel.getNonSuspendedStudentsByEmail = jest.fn().mockResolvedValue(student);

      const result = await studentModel.getNonSuspendedStudentsByEmail("student@example.com");

      expect(result).toEqual(student);
      expect(studentModel.getNonSuspendedStudentsByEmail).toHaveBeenCalledWith("student@example.com");
    });

    it("should return null if student is suspended", async () => {
      studentModel.getNonSuspendedStudentsByEmail = jest.fn().mockResolvedValue(null);

      const result = await studentModel.getNonSuspendedStudentsByEmail("suspended@student.com");

      expect(result).toBeNull();
      expect(studentModel.getNonSuspendedStudentsByEmail).toHaveBeenCalledWith("suspended@student.com");
    });

    it("should throw an error if there is an internal server error", async () => {
      studentModel.getNonSuspendedStudentsByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

      await expect(studentModel.getNonSuspendedStudentsByEmail("student@example.com")).rejects.toThrow("Internal server error");
      expect(studentModel.getNonSuspendedStudentsByEmail).toHaveBeenCalledWith("student@example.com");
    });
  });

  describe("updateStudentByEmail", () => {
    it("should update student data if student is found", async () => {
      const updatedStudent = { id: 1, email: "student@example.com", suspended: true };
      studentModel.updateStudentByEmail = jest.fn().mockResolvedValue(updatedStudent);

      const result = await studentModel.updateStudentByEmail("student@example.com", { suspended: true });

      expect(result).toEqual(updatedStudent);
      expect(studentModel.updateStudentByEmail).toHaveBeenCalledWith("student@example.com", { suspended: true });
    });

    it("should return null if student is not found", async () => {
      studentModel.updateStudentByEmail = jest.fn().mockResolvedValue(null);

      const result = await studentModel.updateStudentByEmail("nonexistent@example.com", { suspended: true });

      expect(result).toBeNull();
      expect(studentModel.updateStudentByEmail).toHaveBeenCalledWith("nonexistent@example.com", { suspended: true });
    });

    it("should throw an error if there is an internal server error", async () => {
      studentModel.updateStudentByEmail = jest.fn().mockRejectedValue(new Error("Internal server error"));

      await expect(studentModel.updateStudentByEmail("student@example.com", { suspended: true })).rejects.toThrow("Internal server error");
      expect(studentModel.updateStudentByEmail).toHaveBeenCalledWith("student@example.com", { suspended: true });
    });
  });
});
