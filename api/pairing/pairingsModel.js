const db = require("../../db/dbConfig");
const TABLE_NAME = "pairings";

module.exports = {
  addPairing,
  editPairing,
  deletePairing,
  getAllPairings,
  getPairingBy,
};

function addPairing(info) {
  return db(TABLE_NAME).insert(info, "pair_id");
}

function editPairing(pair_id, pairEdits) {
  return db(TABLE_NAME).where({ pair_id }).update(pairEdits);
}

function deletePairing(pair_id) {
  return db(TABLE_NAME).del().where({ pair_id });
}

function getAllPairings() {
  return db(TABLE_NAME);
}

function getPairingBy(filterName, filterValue) {
  switch (filterName) {
    case "pair_id":
      return db(TABLE_NAME).where({ pair_id: filterValue });
    case "month+year":
      return db("pairings as p").join("femmegineers as f", function(){
        this.on('p.pair1', '=', 'f.femme_id').orOn('p.pair2', '=', 'f.femme_id')
      }).where({
        "p.year": filterValue[1],
        "p.month": filterValue[0],
      }).select('p.pair_id', 'p.year', 'p.month', 'f.femme_id', ).orderBy("p.pair_id");
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
