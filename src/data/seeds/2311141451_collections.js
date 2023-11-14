const { tables } = require('..');

module.exports = {
  // 👇 1
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.collection).delete(); // 👈 2

    // then add the fresh places
    await knex(tables.collection).insert([
      { id: 1, userId: 1, value: 0 },
      { id: 1, userId: 2, value: 0 },
    ]); // 👈 3
  },
};
