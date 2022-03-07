const supertest = require("supertest");
const server = require("../../server");
const db = require("../../../db/dbConfig");
const TABLE_NAME = "femmegineers";

function getTestFemme() {
  return [
    { initials: "jd", department_id: 1, active: true },
    { initials: "mmw", department_id: 2, active: true },
    { initials: "as", department_id: 1, active: true },
    { initials: "asd", department_id: 2, active: false },
  ];
}

function getDBFemme() {
  return [
    { femme_id: 1, initials: "jd", department_id: 1, active: true },
    { femme_id: 2, initials: "mmw", department_id: 2, active: true },
    { femme_id: 3, initials: "as", department_id: 1, active: true },
    { femme_id: 4, initials: "asd", department_id: 2, active: false },
  ];
}

function getTestDepartments() {
  return [
    { department: "engineering" },
    { department: "security" },
    { department: "quality engineering" },
  ];
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe("femmeRouter", () => {
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE femmegineers RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE departments RESTART IDENTITY CASCADE");

    const list = getTestDepartments();
    await asyncForEach(list, async (department) => {
      await db("departments").insert(department);
    });
  });

  describe("GET /", () => {
    beforeEach(async () => {
      const list = getTestFemme();

      await asyncForEach(list, async (femme) => {
        await db(TABLE_NAME).insert(femme);
      });
    });

    it("returns 200 OK when successful", async () => {
      const res = await supertest(server).get("/femme");
      expect(res.statusCode).toBe(200);
    });

    it("returns 200 message when successful", async () => {
      const expected_list = getDBFemme();
      const res = await supertest(server).get("/femme");
      expect(res.body).toEqual({ femme_list: expected_list });
    });
  });

  describe("POST /", () => {
    it("returns 200 OK when successful", async () => {
      const list = getTestFemme();
      let res = await supertest(server).post("/femme").send(list[0]);
      expect(res.statusCode).toBe(201);

      res = await supertest(server).post("/femme").send(list[1]);
      expect(res.statusCode).toBe(201);

      res = await supertest(server)
        .post("/femme")
        .send({ department_id: 1, initials: "zzz" });
      expect(res.statusCode).toBe(201);
    });

    it("returns 200 message when successful", async () => {
      const list = getTestFemme();
      let res = await supertest(server).post("/femme").send(list[0]);
      expect(res.body).toEqual({ femme_id: 1 });

      res = await supertest(server).post("/femme").send(list[1]);
      expect(res.body).toEqual({ femme_id: 2 });
    });

    it("returns 400 Bad Request when missing required elements", async () => {
      let res = await supertest(server).post("/femme").send({});
      expect(res.statusCode).toBe(400);

      res = await supertest(server)
        .post("/femme")
        .send({ department_id: "1", initials: 1 });
      expect(res.statusCode).toBe(400);

      res = await supertest(server).post("/femme").send({ department_id: 1 });
      expect(res.statusCode).toBe(400);

      res = await supertest(server).post("/femme").send({ initials: "jd" });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 message when missing required elements", async () => {
      const list = getTestFemme();
      let res = await supertest(server).post("/femme").send({});
      expect(res.body).toEqual({ message: "Wrong femme format" });

      res = await supertest(server)
        .post("/femme")
        .send({ department_id: "1", initials: 1 });
      expect(res.body).toEqual({ message: "Wrong femme format" });

      res = await supertest(server).post("/femme").send({ department_id: 1 });
      expect(res.body).toEqual({ message: "Wrong femme format" });

      res = await supertest(server).post("/femme").send({ initials: "jd" });
      expect(res.body).toEqual({ message: "Wrong femme format" });
    });
  });

  describe("PUT /:id", () => {
    beforeEach(async () => {
      const list = getTestFemme();

      await asyncForEach(list, async (femme) => {
        await db(TABLE_NAME).insert(femme);
      });
    });

    it("returns 200 OK when successful", async () => {
      const res = await supertest(server)
        .put("/femme/1")
        .send({ active: false });
      expect(res.statusCode).toBe(200);
    });

    it("returns 200 message when successful", async () => {
      const res = await supertest(server)
        .put("/femme/1")
        .send({ active: false });
      expect(res.body).toEqual({
        message: "Successfully updated 1 femmegineer",
      });
    });

    it("returns 400 Bad Request no femmegineer with that id", async () => {
      const res = await supertest(server)
        .put("/femme/10")
        .send({ active: false });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 message no femmegineer with that id", async () => {
      const res = await supertest(server)
        .put("/femme/10")
        .send({ active: false });
      expect(res.body).toEqual({ message: "No femmegineer with that id" });
    });
  });

  describe("DELETE /:id", () => {
    beforeEach(async () => {
      const list = getTestFemme();

      await asyncForEach(list, async (femme) => {
        await db(TABLE_NAME).insert(femme);
      });
    });

    it("returns 200 OK when successful", async () => {
      const res = await supertest(server).delete("/femme/1");
      expect(res.statusCode).toBe(200);
    });

    it("returns 200 message when successful", async () => {
      const res = await supertest(server).delete("/femme/1");
      expect(res.body).toEqual({
        message: "Successfully deleted femmegineer with id 1",
      });
    });

    it("returns 400 Bad Request no femmegineer with that id", async () => {
      const res = await supertest(server).delete("/femme/10");
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 message no femmegineer with that id", async () => {
      const res = await supertest(server).delete("/femme/10");
      expect(res.body).toEqual({ message: "No femmegineer with that id" });
    });
  });
});
