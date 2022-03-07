exports.up = function(knex) {
  return knex.schema.createTable('pairings', (tbl)=>{
      tbl.increments('pair_id');
      tbl.integer('year');
      tbl.string('month');
      tbl.integer('pair1');
      tbl.integer('pair2');
  })
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists("pairings");
};
