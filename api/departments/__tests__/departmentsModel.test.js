const db = require("../../../db/dbConfig");
const Departments = require("../departmentsModel");
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

describe("departmentsModel", () => {
  //wipes all tables in database clean
  beforeEach(async () => {
    await db.raw("TRUNCATE TABLE departments RESTART IDENTITY CASCADE");
  });

  describe("addDepartment", () => {
    it("adds department to empty db", async () => {
      const list = getTestDepartments();
      const expected_list = getExpectedDepartments();

      const department = await Departments.addDepartment(list[0].department);
      const db_department = await db(TABLE_NAME);
      expect(department).toEqual([{ department_id: 1 }]);
      expect(db_department).toEqual([expected_list[0]]);
    });

    it("adds department to non-empty db", async () => {
      const list = getTestDepartments();
      const expected_list = getExpectedDepartments();

      await asyncForEach([list[0], list[1]], async (department) => {
        await db(TABLE_NAME).insert(department);
      });

      const department = await Departments.addDepartment(list[2].department);
      const db_department = await db(TABLE_NAME);
      expect(department).toEqual([{ department_id: 3 }]);
      expect(db_department).toEqual(expected_list);
    });
  });

  describe("editDepartment", () => {
    beforeEach(async () => {
      const test_list = getTestDepartments();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("successfully edits a department", async () => {
      const expected_list = getExpectedDepartments();
      await Departments.editDepartment(1, { department: "E" });
      let db_list = await db(TABLE_NAME).where({ department_id: 1 });

      expect(db_list[0]).toEqual({ department_id: 1, department: "E" });

      await Departments.editDepartment(10, { department: "E" });
      db_list = await db(TABLE_NAME).orderBy("department_id");
      expect(db_list).toEqual([
        { department_id: 1, department: "E" },
        expected_list[1],
        expected_list[2],
      ]);
    });
  });

  describe("getAllDepartments", () => {
    beforeEach(async () => {
      const test_list = getTestDepartments();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("gets all departments", async () => {
      const test_list = await Departments.getAllDepartments();
      const expected_list = getExpectedDepartments();

      expect(test_list).toEqual(expected_list);
    });
  });

  describe("deleteDepartment", () => {
    beforeEach(async () => {
      const test_list = getTestDepartments();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("successfully deletes department", async () => {
      await Departments.deleteDepartment(1);
      const expected_list = getExpectedDepartments();

      const db_list = await db(TABLE_NAME);

      expect(db_list).toEqual([expected_list[1], expected_list[2]]);
    });
  });

  describe("getDepartmentById", () => {
    beforeEach(async () => {
      const test_list = getTestDepartments();
      await asyncForEach(test_list, async (pair) => {
        await db(TABLE_NAME).insert(pair);
      });
    });

    it("gets department by id", async () => {
      const expected_list = getExpectedDepartments();
      let department = await Departments.getDepartmentById(1);
      expect(department).toEqual(expected_list[0]);

      department = await Departments.getDepartmentById(10);
      expect(department).toEqual(undefined);
    });
  });
});
