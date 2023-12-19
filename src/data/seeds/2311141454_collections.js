const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.coin).delete();
    await knex(tables.collection).delete();

    await knex(tables.collection).insert([
      { id: 1, userId: 1, value: 0 },
    ]);
  },
};
