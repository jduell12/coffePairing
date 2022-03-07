const router = require("express").Router();
const Departments = require("./departmentsModel");
const { departmentValid, validId } = require("./helpers");

router.get("/:id", (req, res) => {
  Departments.getDepartmentById(req.params.id)
    .then((department) => {
      res.status(200).json(department);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not retrieve that department with that id",
      });
    });
});

router.get("/", (req, res) => {
  Departments.getAllDepartments()
    .then((departments) => {
      res.status(200).json({ departments });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not retrieve departments",
      });
    });
});

router.post("/", (req, res) => {
  const department = req.body.department;
  if (departmentValid(department)) {
    Departments.addDepartment(department)
      .then((id) => {
        res.status(201).json(id[0]);
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
          message: "Could not add department",
        });
      });
  } else {
    res.status(400).json({ message: "Please add a department as a string" });
  }
});

router.put("/:id", validId, (req, res) => {
  Departments.editDepartment(req.params.id, req.body)
    .then((count) => {
      res
        .status(200)
        .json({ message: `Successsfully edited ${count} department` });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not edit department",
      });
    });
});

router.delete("/:id", validId, (req, res) => {
  Departments.deleteDepartment(req.params.id)
    .then(() => {
      res.status(200).json({
        message: `Successfully deleted department with id ${req.params.id}`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not delete department",
      });
    });
});

module.exports = router;
