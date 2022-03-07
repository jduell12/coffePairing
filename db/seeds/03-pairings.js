exports.seed = async function (knex) {
  await knex("pairings").insert([
    { year: 2022, month: "March", pair1: 1, pair2: 8 },
    { year: 2022, month: "March", pair1: 2, pair2: 12 },
    { year: 2022, month: "March", pair1: 3, pair2: 5 },
    { year: 2022, month: "March", pair1: 4, pair2: 18 },
    { year: 2022, month: "March", pair1: 6, pair2: 15 },
    { year: 2022, month: "March", pair1: 7, pair2: 20 },
    { year: 2022, month: "March", pair1: 9, pair2: 23 },
    { year: 2022, month: "March", pair1: 10, pair2: 13 },
    { year: 2022, month: "March", pair1: 11, pair2: 21 },
    { year: 2022, month: "March", pair1: 14, pair2: 24 },
    { year: 2022, month: "March", pair1: 16, pair2: 22 },
    { year: 2022, month: "March", pair1: 17, pair2: 19 },
    { year: 2022, month: "March", pair1: 25, pair2: 26 },
  ]);
};
