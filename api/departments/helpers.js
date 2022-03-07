const Departments = require("./departmentsModel");

module.exports = {
  departmentValid,
  validId,
};

function departmentValid(department) {
  return Boolean(
    department.department && typeof department.department === "string",
  );
}

function validId(req, res, next) {
  const id = req.params.id;
  Departments.getDepartmentById(id).then((department) => {
    if (department) {
      next();
    } else {
      res.status(400).json({ message: "No department exists with that id" });
    }
  });
}
