const db = require("../../db/dbConfig");
const TABLE_NAME = "departments";

module.exports = {
  addDepartment,
  editDepartment,
  getAllDepartments,
  deleteDepartment,
  getDepartmentById,
};

function addDepartment(info) {
  return db(TABLE_NAME).insert(info, "department_id");
}

function editDepartment(department_id, edits) {
  return db(TABLE_NAME).where({ department_id }).update(edits);
}

function getAllDepartments() {
  return db(TABLE_NAME);
}

function deleteDepartment(department_id) {
  return db(TABLE_NAME).del().where({ department_id });
}

function getDepartmentById(department_id) {
  return db(TABLE_NAME).where({ department_id });
}
