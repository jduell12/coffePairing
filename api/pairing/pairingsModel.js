const db = require("../../db/dbConfig");
const TABLE_NAME = "pairings";

function addPairing(info) {
  return db(TABLE_NAME).insert(info, "pair_id");
}

function editPairing(pair_id, pairEdits) {
  return db(TABLE_NAME).where({ pair_id }).update(pairEdits);
}

function deletePairing(pair_id) {
  return db(TABLE_NAME).del().where({ pair_id });
}

function deletePairingByDate({ month, year }) {
  return db(TABLE_NAME).del().where({ month, year });
}

function getAllPairings() {
  return db(TABLE_NAME);
}

function getPairingBy(filterName, filterValue) {
  switch (filterName) {
    case "pair_id":
      return db(TABLE_NAME).where({ pair_id: filterValue });
    case "month+year":
      return db(TABLE_NAME).where({
        year: filterValue[1],
        month: filterValue[0],
      });
    case "year":
      return db(TABLE_NAME).where({ year: filterValue });
    case "month":
      return db(TABLE_NAME).where({ month: filterValue });
    case "pair1":
      return db(TABLE_NAME).where({ pair1: filterValue });
    case "pair2":
      return db(TABLE_NAME).where({ pair2: filterValue });
    default:
      return False;
  }
}


module.exports = {
  addPairing,
  editPairing,
  deletePairing,
  deletePairingByDate,
  getAllPairings,
  getPairingBy,
};