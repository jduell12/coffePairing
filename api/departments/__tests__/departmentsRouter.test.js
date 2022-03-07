const supertest = require("supertest");
const server = require("../../server");
const db = require("../../../db/dbConfig");
const TABLE_NAME = "departments";

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

function getTestDepartments() {
  return [
    { department: "engineering" },
    { department: "security" },
    { department: "quality engineering" },
  ];
}

function getExpectedDepartments() {
  return [
    { department_id: 1, department: "engineering" },
    { department_id: 2, department: "security" },
    { department_id: 3, department: "quality engineering" },
  ];
}

describe("departmentsRouter", () => {
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE departments RESTART IDENTITY CASCADE");
  });

  describe("GET /:id", () => {
    beforeEach(async () => {
      const list = getTestDepartments();

      await asyncForEach(list, async (department) => {
        await db(TABLE_NAME).insert(department);
      });
    });

    it("returns 200 OK when successful", async () => {
      let res = await supertest(server).get("/departments/1");
      expect(res.status).toBe(200);

      res = await supertest(server).get("/departments/10");
      expect(res.status).toBe(200);
    });

    it("returns 200 success message", async () => {
      let res = await supertest(server).get("/departments/1");
      expect(res.body).toEqual({ department: "engineering" });

      res = await supertest(server).get("/departments/10");
      expect(res.body).toEqual("");
    });
  });

  describe("GET /", () => {
    beforeEach(async () => {
      const list = getTestDepartments();

      await asyncForEach(list, async (department) => {
        await db(TABLE_NAME).insert(department);
      });
    });

    it("returns 200 OK", async () => {
      const expected_list = getExpectedDepartments();
      let res = await supertest(server).get("/departments");
      expect(res.status).toEqual(200);
    });

    it("returns a list of departments", async () => {
      const expected_list = getExpectedDepartments();
      let res = await supertest(server).get("/departments");
      expect(res.body).toEqual({ departments: expected_list });
    });
  });

  describe("POST /", () => {
    it("returns 201 Created", async () => {
      const list = getTestDepartments();
      let res = await supertest(server)
        .post("/departments")
        .send({ department: list[0] });

      expect(res.statusCode).toBe(201);

      res = await supertest(server)
        .post("/departments")
        .send({ department: list[1] });

      expect(res.statusCode).toBe(201);
    });

    it("returns 201 message", async () => {
      const list = getTestDepartments();
      let res = await supertest(server)
        .post("/departments")
        .send({ department: list[0] });

      expect(res.body).toEqual({ department_id: 1 });

      res = await supertest(server)
        .post("/departments")
        .send({ department: list[1] });

      expect(res.body).toEqual({ department_id: 2 });
    });

    it("returns 400 Bad Request when wrong type is sent in body", async () => {
      const res = await supertest(server)
        .post("/departments")
        .send({ department: 1 });

      expect(res.statusCode).toEqual(400);
    });

    it("returns 400 message when wrong type is sent in body", async () => {
      const res = await supertest(server)
        .post("/departments")
        .send({ department: 1 });

      expect(res.body).toEqual({
        message: "Please add a department as a string",
      });
    });
  });

  describe("PUT /:id", () => {
    beforeEach(async () => {
      const list = getTestDepartments();

      await asyncForEach(list, async (department) => {
        await db(TABLE_NAME).insert(department);
      });
    });

    it("returns 200 OK when successful", async () => {
      let res = await supertest(server)
        .put("/departments/1")
        .send({ department: "E" });

      expect(res.statusCode).toBe(200);
    });

    it("returns 200 message when successful", async () => {
      let res = await supertest(server)
        .put("/departments/1")
        .send({ department: "E" });

      expect(res.body).toEqual({
        message: "Successsfully edited 1 department",
      });
    });

    it("returns 400 Bad Request when no department with id exists", async () => {
      let res = await supertest(server)
        .put("/departments/10")
        .send({ department: "E" });

      expect(res.statusCode).toBe(400);
    });

    it("returns 400 message when no department with id exists", async () => {
      let res = await supertest(server)
        .put("/departments/10")
        .send({ department: "E" });

      expect(res.body).toEqual({
        message: "No department exists with that id",
      });
    });
  });

  describe("DELETE /:id", () => {
    beforeEach(async () => {
      const list = getTestDepartments();

      await asyncForEach(list, async (department) => {
        await db(TABLE_NAME).insert(department);
      });
    });

    it("returns 200 OK when successful", async () => {
      const res = await supertest(server).delete("/departments/1");
      expect(res.statusCode).toBe(200);
    });

    it("returns 200 message when successful", async () => {
      const res = await supertest(server).delete("/departments/1");
      expect(res.body).toEqual({
        message: "Successfully deleted department with id 1",
      });
    });

    it("returns 400 Bad Request when no department with that id exists", async () => {
      const res = await supertest(server).delete("/departments/10");
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 message when no department with that id exists", async () => {
      const res = await supertest(server).delete("/departments/10");
      expect(res.body).toEqual({
        message: "No department exists with that id",
      });
    });
  });
});
