exports.up = function (knex) {
  return knex.schema.createTable("pairings", (tbl) => {
    tbl.increments("pair_id");
    tbl.integer("year").notNullable();
    tbl.string("month").notNullable();
    tbl.integer("pair1").notNullable();
    tbl.integer("pair2").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("pairings");
};
