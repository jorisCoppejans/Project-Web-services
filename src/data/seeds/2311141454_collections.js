const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.collection).delete();

    // then add the fresh places
    await knex(tables.collection).insert([
      { id: 1, userId: 1, value: 0 },
      { id: 2, userId: 2, value: 0 },
    ]);
  },
};
