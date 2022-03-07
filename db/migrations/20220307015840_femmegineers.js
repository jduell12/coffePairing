exports.up = function (knex) {
  return knex.schema
    .createTable("departments", (tbl) => {
      tbl.increments("department_id");
      tbl.string("department").notNullable();
    })
    .createTable("femmegineers", (tbl) => {
      tbl.increments("femme_id");
      tbl.string("initials").notNullable();
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
    .dropTableIfExists("femmegineers")
    .dropTableIfExists("departments");
};
