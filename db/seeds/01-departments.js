exports.seed = async function(knex) {
  await knex("departments").insert([
    { department: "engineering" },
    { department: "security" },
    { department: "quality engineering" },
    { department: "scrum" },
    { department: "compliance engineering" },
    { department: "product" },
    { department: "people" },
    { department: "ops" },
    { department: "data science" },
    {department: "sales" },
    { department: "professional services" }
  ]);
};
