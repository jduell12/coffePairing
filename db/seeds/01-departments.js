exports.seed = async function(knex) {
  await knex("departments").insert([
    { department_id: 1, department: "engineering" },
    { department_id: 2, department: "security" },
    { department_id: 3, department: "quality engineering" },
    { department_id: 4, department: "scrum" },
    { department_id: 5, department: "compliance engineering" },
    { department_id: 6, department: "product" },
    { department_id: 7, department: "people" },
    { department_id: 8, department: "ops" },
    { department_id: 9, department: "data science" },
  ]);
};
