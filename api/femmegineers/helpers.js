const Femme = require("./femmegineersModel");

module.exports = {
  femmeValid,
  validId,
};

function femmeValid(femme) {
  return Boolean(
    femme.department_id &&
      femme.name &&
      typeof femme.department_id === "number" &&
      typeof femme.name === "string",
  );
}

function validId(req, res, next) {
  const id = req.params.id;

  Femme.getFemmeBy("femme_id", id).then((femme) => {
    if (femme.length > 0) {
      next();
    } else {
      res.status(400).json({ message: "No femmegineer with that id" });
    }
  });
}
