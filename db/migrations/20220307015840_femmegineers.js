exports.up = function(knex) {
  return knex.schema
    .createTable("departments", (tbl) => {
      tbl.increments("department_id");
      tbl.string("department");
    })
    .createTable("femmegineers", (tbl) => {
      tbl.increments("femme_id");
      tbl.string("initials");
      tbl.boolean("active");
      tbl.integer("department_id").unsigned().references('departments.department_id').onDelete('CASCADE').onUpdate('CASCADE')
      
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("femmegineers")
    .dropTableIfExists("departments");
};
