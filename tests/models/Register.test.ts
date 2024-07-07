import { RegistrationModel } from "../../src/models/Register";

jest.mock("../../src/models/Register");

describe("RegistrationModel", () => {
  let registrationModel;

  beforeEach(() => {
    registrationModel = new RegistrationModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRegistration", () => {
    it("should create a new registration", async () => {
      const newRegistration = { id: 1, teacherId: 1, studentId: 1 };
      registrationModel.createRegistration = jest.fn().mockResolvedValue(newRegistration);

      const result = await registrationModel.createRegistration(newRegistration);

      expect(result).toEqual(newRegistration);
      expect(registrationModel.createRegistration).toHaveBeenCalledWith(newRegistration);
    });
  });

  describe("getCommonStudentsByTeacherId", () => {
    it("should return common students for given teacher IDs", async () => {
      const teacherIds = [1, 2];
      const commonStudents = [{ id: 1, email: "student1@example.com" }];
      registrationModel.getCommonStudentsByTeacherId = jest.fn().mockResolvedValue(commonStudents);

      const result = await registrationModel.getCommonStudentsByTeacherId(teacherIds);

      expect(result).toEqual(commonStudents);
      expect(registrationModel.getCommonStudentsByTeacherId).toHaveBeenCalledWith(teacherIds);
    });

    it("should return an empty array if no teacher IDs are provided", async () => {
      registrationModel.getCommonStudentsByTeacherId = jest.fn().mockResolvedValue([]);

      const result = await registrationModel.getCommonStudentsByTeacherId([]);

      expect(result).toEqual([]);
      expect(registrationModel.getCommonStudentsByTeacherId).toHaveBeenCalledWith([]);
    });
  });

  describe("getNonSuspendedStudentsByTeacherId", () => {
    it("should return non-suspended students for a given teacher ID", async () => {
      const teacherId = 1;
      const nonSuspendedStudents = [{ id: 1, email: "student1@example.com", suspended: false }];
      registrationModel.getNonSuspendedStudentsByTeacherId = jest.fn().mockResolvedValue(nonSuspendedStudents);

      const result = await registrationModel.getNonSuspendedStudentsByTeacherId(teacherId);

      expect(result).toEqual(nonSuspendedStudents);
      expect(registrationModel.getNonSuspendedStudentsByTeacherId).toHaveBeenCalledWith(teacherId);
    });

    it("should return an empty array if no non-suspended students are found", async () => {
      const teacherId = 1;
      registrationModel.getNonSuspendedStudentsByTeacherId = jest.fn().mockResolvedValue([]);

      const result = await registrationModel.getNonSuspendedStudentsByTeacherId(teacherId);

      expect(result).toEqual([]);
      expect(registrationModel.getNonSuspendedStudentsByTeacherId).toHaveBeenCalledWith(teacherId);
    });
  });
});
