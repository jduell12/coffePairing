const router = require("express").Router();
const Pairings = require("./pairingsModel");
const Femme = require("../femmegineers/femmegineersModel");
const Departments = require("../departments/departmentsModel");

router.post("/:month/:year", async (req, res) => {
  const { month, year } = req.params;
  //get all active femme
  const femme_list = await Femme.getFemmeBy("active", true);
  //get previous pairings
  const prev_pair = await Pairings.getPairingBy("year", year);

  //if femme list is an odd number pop the last person to send to caller
  let extra_femme = "";
  if (femme_list.length % 2 != 0) {
    extra_femme = femme_list.pop();
  }

  //create a new list of only femme ids
  let femme_id_list = femme_list.map((femme) => {
    return femme.femme_id;
  });

  //randomly pair femme
  const pairs = getPairs(femme_id_list, [], month, year);

  let doubles = getDoubles(pairs, prev_pair, []);

  if (doubles.length > 0) {
    for (let i = 0; i < doubles.length - 1; i += 2) {
      let i1 = pairs.indexOf(doubles[i]);
      let i2 = pairs.indexOf(doubles[i + 1]);

      let p1 = pairs[i1];
      let p2 = pairs[i2];

      let pair1 = p1.pair1;
      p1.pair1 = p2.pair1;
      p2.pair1 = pair1;

      pairs[i1] = p1;
      pairs[i2] = p2;
    }
  }

  for (let i = 0; i < pairs.length; i++) {
    await Pairings.addPairing(pairs[i]);
  }

  //check that pairs have not been together in the year
  res.status(200).json({ pairs });
});

module.exports = router;

function checkInArr(item, array) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

function getPairs(array, pairs, month, year) {
  //copy femme id list so have two arrays
  let arr1 = array.slice();
  let arr2 = array.slice();

  //shuffle lists randomly
  arr1.sort(function () {
    return 0.5 - Math.random();
  });
  arr2.sort(function () {
    return 0.5 - Math.random();
  });

  //match up pairs
  while (arr1.length) {
    let index1 = arr1.pop();
    let index2 = arr2[0] == index1 ? arr2.pop() : arr2.shift();

    //check if indices are in each array and remove them
    arr1 = checkInArr(index1, arr1);
    arr1 = checkInArr(index2, arr1);
    arr2 = checkInArr(index1, arr2);
    arr2 = checkInArr(index2, arr2);

    pairs.push({ month: month, year: year, pair1: index1, pair2: index2 });
  }
  return pairs;
}

function getDoubles(array1, array2, doubles) {
  array1.forEach((pair) => {
    let pair1 = pair.pair1;
    let pair2 = pair.pair2;

    array2.forEach((prev) => {
      if (
        (pair1 === prev.pair1 && pair2 === prev.pair2) ||
        (pair1 === prev.pair2 && pair2 === prev.pair1)
      ) {
        let i1 = doubles.indexOf(pair1);
        if (i1 === -1) {
          doubles.push(pair);
        }
      }
    });
  });
  return doubles;
}
