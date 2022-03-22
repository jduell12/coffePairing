const supertest = require("supertest");
const server = require("../../server");
const db = require("../../../db/dbConfig");

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

function getTestFemme() {
  return [
    { initials: "jd", department_id: 1, active: true },
    { initials: "mmw", department_id: 2, active: true },
    { initials: "asd", department_id: 2, active: false },
    { initials: "ds", department_id: 3, active: true },
    { initials: "wc", department_id: 2, active: true },
  ];
}

function getTestPairings() {
  return [
    { year: 2021, month: "March", pair1: 1, pair2: 2 },
    { year: 2021, month: "March", pair1: 4, pair2: 5 },
  ];
}

describe("pairingsRouter", () => {
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE departments RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE femmegineers RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE pairings RESTART IDENTITY CASCADE");

    const department = getTestDepartments();
    const femme = getTestFemme();
    const pairing = getTestPairings();

    await asyncForEach(department, async (d) => {
      await db("departments").insert(d);
    });

    await asyncForEach(femme, async (f) => {
      await db("femmegineers").insert(f);
    });

    await asyncForEach(pairing, async (pair) => {
      await db("pairings").insert(pair);
    });
  });

  describe("POST /:month:year", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(server).post("/pairing/April/2021");
      expect(res.statusCode).toBe(200);
    });

    it("returns new pairings", async () => {
      const res = await supertest(server).post("/pairing/April/2021");
      expect(res.body.pairs).toHaveLength(2);
    });
  });

  describe("GET /:month/:year", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(server).get("/pairing/March/2021");
      expect(res.statusCode).toBe(200);
    });

    it("returns new pairings", async () => {
      const res = await supertest(server).get("/pairing/March/2021");
      expect(res.body).toEqual({
        month: "March",
        year: "2021",
        pairs: [
          {
            pair1: {
              femme_id: 1,
              initials: "jd",
              active: true,
              department_id: 1,
            },
            pair2: {
              femme_id: 2,
              initials: "mmw",
              active: true,
              department_id: 2,
            },
          },
          {
            pair1: {
              femme_id: 4,
              initials: "ds",
              active: true,
              department_id: 3,
            },
            pair2: {
              femme_id: 5,
              initials: "wc",
              active: true,
              department_id: 2,
            },
          },
        ],
      });
    });
  });
});
