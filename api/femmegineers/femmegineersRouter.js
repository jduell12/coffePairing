const router = require("express").Router();
const Femme = require("./femmegineersModel");
const { validId, femmeValid } = require("./helpers");

router.get("/", (req, res) => {
  Femme.getAllFemme()
    .then((femme_list) => {
      res.status(200).json({ total: femme_list.length,femme_list });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not retrieve femmegineers",
      });
    });
});

router.get("/active", (req, res) => {
  Femme.getActiveFemme()
    .then((femme_list) => {
      res.status(200).json({ total: femme_list.length,femme_list });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not retrieve femmegineers",
      });
    });
});

router.post("/", (req, res) => {
  const femme = req.body;

  if (femmeValid(femme)) {
    Femme.addFemme(femme)
      .then((id) => {
        res.status(201).json(id[0]);
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
          message: "Could not add femmegineers",
        });
      });
  } else {
    res.status(400).json({ message: "Wrong femme format" });
  }
});

router.put("/:id", validId, (req, res) => {
  Femme.editFemme(req.params.id, req.body)
    .then((count) => {
      res
        .status(200)
        .json({ message: `Successfully updated ${count} femmegineer` });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not edit femmegineers",
      });
    });
});

router.delete("/:id", validId, (req, res) => {
  Femme.deleteFemme(req.params.id)
    .then(() => {
      res
        .status(200)
        .json({
          message: `Successfully deleted femmegineer with id ${req.params.id}`,
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        message: "Could not delete femmegineers",
      });
    });
});

module.exports = router;
