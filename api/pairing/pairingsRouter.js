const router = require("express").Router();
const Pairings = require("./pairingsModel");
const Femme = require("../femmegineers/femmegineersModel");
const Departments = require("../departments/departmentsModel");

router.post("/", async (req, res) => {
  //get all active femme
  const femme_list = await Femme.getFemmeBy("active", true);
  console.log(femme_list);
  //separate by department
  //get previous pairings
  //randomly pair femme
  //check that pairs have not been together in the year
  res.status(200).end();
});

module.exports = router;
