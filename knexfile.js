const pgConnection =
  process.env.DATABASE_URL || "postgresql://postgres@localhost/coffee";

module.exports = {
  development: {
    client: "pg",
    connection: "postgresql://postgres@localhost/coffee_test",
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
    useNullAsDefault: true,
  },

  testing: {
    client: "pg",
    connection: "postgresql://postgres@localhost/coffee_test",
    migrations: {
      directory: "./db/migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: "./db/seeds",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: pgConnection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};