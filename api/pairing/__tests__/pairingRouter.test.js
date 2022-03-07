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
    { year: 2021, month: "March", pair1: 1, pair2: 8 },
    { year: 2021, month: "March", pair1: 2, pair2: 12 },
    { year: 2021, month: "March", pair1: 3, pair2: 5 },
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

  describe("POST /", () => {
    it.only("returns 200 OK", async () => {
      const res = await supertest(server)
        .post("/pairing")
        .send({ month: "April", year: 2022 });
      expect(res.statusCode).toBe(200);
    });
  });
});
