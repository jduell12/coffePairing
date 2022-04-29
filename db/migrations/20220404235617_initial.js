exports.up = function (knex) {
  return knex.schema
    .createTable("pairings", (tbl) => {
      tbl.increments("pair_id");
      tbl.integer("year").notNullable();
      tbl.string("month").notNullable();
      tbl.integer("pair1").notNullable();
      tbl.integer("pair2").notNullable();
    })
    .createTable("departments", (tbl) => {
      tbl.increments("department_id");
      tbl.string("department").notNullable();
    })
    .createTable("femmegineers", (tbl) => {
      tbl.increments("femme_id");
      tbl.string("name").notNullable();
      tbl.boolean("active").notNullable().defaultTo(1);
      tbl
        .integer("department_id")
        .unsigned()
        .references("departments.department_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("pairings")
    .dropTableIfExists("departments")
    .dropTableIfExists("femmegineers");

};
