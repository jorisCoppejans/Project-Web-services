const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.coin).delete();

    await knex(tables.coin).insert([
      { id: 1, name: "ADP", value: 34000 , collectionId: 1, favorite: true},
      // { id: 2, name: "ETH", value: 1800 , collectionId: 1, favorite: true },
      // { id: 3, name: "BNB", value: 200 , collectionId: 1, favorite: false },
    ]);
  },
};
