const db = require("../../../db/dbConfig");
const Femme = require("../femmegineersModel");

const TABLE_NAME = "femmegineers";

function getTestFemme() {
  return [
    { name: "jd", department_id: 1, active: true },
    { name: "mmw", department_id: 2, active: true },
    { name: "as", department_id: 1, active: true },
    { name: "asd", department_id: 2, active: false },
  ];
}

function getDBFemme() {
  return [
    { femme_id: 1, name: "jd", department_id: 1, active: true },
    { femme_id: 2, name: "mmw", department_id: 2, active: true },
    { femme_id: 3, name: "as", department_id: 1, active: true },
    { femme_id: 4, name: "asd", department_id: 2, active: false },
  ];
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe("femmegineersModel", () => {
  //wipes all tables in database clean
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE femmegineers RESTART IDENTITY CASCADE");
  });

  describe("addFemme", () => {
    it("adds a femme to empty db", async () => {
      let list = getTestFemme();
      let dbFemme = getDBFemme();

      await Femme.addFemme(list[0]);

      const femme = await db(TABLE_NAME);
      expect(femme.length).toBe(1);
      expect(femme[0]).toEqual(dbFemme[0]);
    });

    it("adds a femme to a non-empty db", async () => {
      let list = getTestFemme();
      let dbFemme = getDBFemme();

      await asyncForEach(list, async (femme) => {
        await Femme.addFemme(femme);
      });

      const femme = await db(TABLE_NAME);
      expect(femme.length).toBe(4);
      expect(femme[0]).toEqual(dbFemme[0]);
      expect(femme[1]).toEqual(dbFemme[1]);
      expect(femme[2]).toEqual(dbFemme[2]);
      expect(femme[3]).toEqual(dbFemme[3]);
    });
  });

  describe("editFemme", () => {
    it("edits a femmegineer successfully", async () => {
      let femme = getTestFemme();
      await db(TABLE_NAME).insert(femme[0]);

      let response = await Femme.editFemme(1, { department_id: 2 });

      let dbList = await db(TABLE_NAME).where({ femme_id: 1 });
      expect(response).toEqual(1);
      expect(dbList[0].department_id).toEqual(2);

      await db(TABLE_NAME).insert(femme[1]);
      await db(TABLE_NAME).insert(femme[2]);

      response = await Femme.editFemme(1, { department_id: 3 });
      dbList = await db(TABLE_NAME).where({ femme_id: 1 });
      expect(response).toEqual(1);
      expect(dbList[0].department_id).toEqual(3);
    });
  });

  describe("getAllFemme", () => {
    it("gets an empty array from an empty db", async () => {
      let list = await Femme.getAllFemme();
      expect(list).toEqual([]);
    });

    it("gets an non-empty array from a non-empty db", async () => {
      let test_list = getTestFemme();
      const expected_list = getDBFemme();

      await asyncForEach(test_list, async (femme) => {
        await Femme.addFemme(femme);
      });

      let list = await Femme.getAllFemme();
      expect(list).toEqual(expected_list);
    });
  });

  describe("deleteFemme", () => {
    it("successfully deletes femme from db", async () => {
      let test_list = getTestFemme();
      const expected_list = getDBFemme();

      await asyncForEach(test_list, async (femme) => {
        await Femme.addFemme(femme);
      });

      await Femme.deleteFemme(1);

      const db_list = await db(TABLE_NAME);
      expect(db_list).toEqual([
        expected_list[1],
        expected_list[2],
        expected_list[3],
      ]);
    });
  });

  describe("getFemmeBy", () => {
    beforeEach(async () => {
      let test_list = getTestFemme();
      await asyncForEach(test_list, async (femme) => {
        await Femme.addFemme(femme);
      });
    });

    it("gets a femme by id", async () => {
      const expected_list = getDBFemme();

      let femme = await Femme.getFemmeBy("femme_id", 1);
      expect(femme[0]).toEqual(expected_list[0]);

      femme = await Femme.getFemmeBy("femme_id", 2);
      expect(femme[0]).toEqual(expected_list[1]);

      femme = await Femme.getFemmeBy("femme_id", 3);
      expect(femme[0]).toEqual(expected_list[2]);
    });

    it("gets a femme by active", async () => {
      const db_femme = getDBFemme();
      const expected_list = [db_femme[0], db_femme[1], db_femme[2]];

      let femme = await Femme.getFemmeBy("active", true);
      expect(femme).toEqual(expected_list);

      femme = await Femme.getFemmeBy("active", false);
      expect(femme).toEqual([db_femme[3]]);
    });

    it("gets a femme by department_id", async () => {
      const db_femme = getDBFemme();
      let expected_list = [db_femme[0], db_femme[2]];

      let femme = await Femme.getFemmeBy("department_id", 1);
      expect(femme).toEqual(expected_list);

      expected_list = [db_femme[1], db_femme[3]];
      femme = await Femme.getFemmeBy("department_id", 2);
      expect(femme).toEqual(expected_list);

      femme = await Femme.getFemmeBy("department_id", 3);
      expect(femme).toEqual([]);
    });

    it("gets a femme by name", async () => {
      const db_femme = getDBFemme();

      let femme = await Femme.getFemmeBy("name", "jd");
      expect(femme).toEqual([db_femme[0]]);

      femme = await Femme.getFemmeBy("name", "mmw");
      expect(femme).toEqual([db_femme[1]]);

      femme = await Femme.getFemmeBy("name", "jds");
      expect(femme).toEqual([]);
    });
  });
});
