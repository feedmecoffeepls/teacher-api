import { registerStudent } from "../../src/controllers/student/register.ts";

describe("Register Student Controller", () => {
  it("registers students for a teacher", async () => {
    const teacherEmail = "teacherken@gmail.com";
    const studentEmails = ["studentjon@gmail.com", "studenthon@gmail.com"];
    const req = { body: { teacher: teacherEmail, students: studentEmails } };
    const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) }; 

    await registerStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(204); 
    expect(res.status().send).toHaveBeenCalled(); 
  });
});

