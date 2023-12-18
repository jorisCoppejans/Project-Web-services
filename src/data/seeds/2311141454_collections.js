const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.coin).del(); // Delete coins first

    await knex(tables.collection).del();

    // then add the fresh places
    await knex(tables.collection).insert([
      { id: 1, userId: 1, value: 0 },
    ]);
  },
};
