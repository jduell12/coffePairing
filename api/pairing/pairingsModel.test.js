const db = require("../../db/dbConfig");
const Pairings = require("./pairingsModel");
const TABLE_NAME = "pairings";

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

function getTestPairings() {
  return [
    { year: 2021, month: "March", pair1: 1, pair2: 8 },
    { year: 2021, month: "March", pair1: 2, pair2: 12 },
    { year: 2021, month: "March", pair1: 3, pair2: 5 },
  ];
}

function getExpectedPairings() {
  return [
    { pair_id: 1, year: 2021, month: "March", pair1: 1, pair2: 8 },
    { pair_id: 2, year: 2021, month: "March", pair1: 2, pair2: 12 },
    { pair_id: 3, year: 2021, month: "March", pair1: 3, pair2: 5 },
  ];
}

describe("pairingsModel", () => {
  //wipes all tables in database clean
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE pairings RESTART IDENTITY CASCADE");
  });

  describe("addPairing", () => {
    it("adds pairing to empty db", async () => {
      let test_list = getTestPairings();
      let expected_list = getExpectedPairings();

      const pairing = await Pairings.addPairing(test_list[0]);
      const db_list = await db(TABLE_NAME);
      expect(pairing).toEqual([{ pair_id: 1 }]);
      expect(db_list).toEqual([expected_list[0]]);
    });

    it("adds pairing to non-empty db", async () => {
      let test_list = getTestPairings();
      let expected_list = getExpectedPairings();
      const list = [test_list[0], test_list[1]];

      await asyncForEach(list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });

      const pairing = await Pairings.addPairing(test_list[2]);
      let db_list = await db(TABLE_NAME);
      expect(pairing).toEqual([{ pair_id: 3 }]);
      expect(db_list.length).toEqual(3);
      expect(db_list).toEqual(expected_list);
    });
  });

  describe("editPairing", () => {
    beforeEach(async () => {
      const test_list = getTestPairings();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("edits a pairing successfully", async () => {
      await Pairings.editPairing(2, { pair1: 20 });
      const db_list = await db(TABLE_NAME).where({ pair_id: 2 });

      expect(db_list[0]).toEqual({
        pair_id: 2,
        year: 2021,
        month: "March",
        pair1: 20,
        pair2: 12,
      });
    });
  });

  describe("deletePairing", () => {
    beforeEach(async () => {
      const test_list = getTestPairings();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("deletes a pairing successfully", async () => {
      await Pairings.deletePairing(2);
      const db_list = await db(TABLE_NAME);
      const expected_list = getExpectedPairings();

      expect(db_list).toEqual([expected_list[0], expected_list[2]]);
    });
  });

  describe("getAllPairings", () => {
    beforeEach(async () => {
      const test_list = getTestPairings();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("gets all pairings successfully", async () => {
      const db_list = await Pairings.getAllPairings();
      const expected_list = getExpectedPairings();

      expect(db_list).toEqual(expected_list);
    });
  });

  describe("getPairingBy", () => {
    beforeEach(async () => {
      const test_list = getTestPairings();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("gets pairing by pair_id", async () => {
      let list = await Pairings.getPairingBy("pair_id", 1);
      const expected_list = getExpectedPairings();

      expect(list[0]).toEqual(expected_list[0]);

      list = await Pairings.getPairingBy("pair_id", 10);
      expect(list).toEqual([]);
    });

    it("gets pairing by year", async () => {
      let list = await Pairings.getPairingBy("year", 2021);
      const expected_list = getExpectedPairings();

      expect(list).toEqual(expected_list);

      list = await Pairings.getPairingBy("year", 2022);
      expect(list).toEqual([]);
    });

    it("gets pairing by month", async () => {
      let list = await Pairings.getPairingBy("month", "March");
      const expected_list = getExpectedPairings();

      expect(list).toEqual(expected_list);

      list = await Pairings.getPairingBy("month", "Jan");
      expect(list).toEqual([]);
    });

    it("gets pairing by pair1", async () => {
      let list = await Pairings.getPairingBy("pair1", 2);
      const expected_list = getExpectedPairings();

      expect(list[0]).toEqual(expected_list[1]);

      list = await Pairings.getPairingBy("pair1", 20);
      expect(list).toEqual([]);
    });

    it("gets pairing by pair2", async () => {
      let list = await Pairings.getPairingBy("pair2", 12);
      const expected_list = getExpectedPairings();

      expect(list[0]).toEqual(expected_list[1]);

      list = await Pairings.getPairingBy("pair2", 20);
      expect(list).toEqual([]);
    });
  });
});
