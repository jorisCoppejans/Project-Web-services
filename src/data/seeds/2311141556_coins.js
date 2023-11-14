const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.coin).delete();

    // then add the fresh places
    await knex(tables.coin).insert([
      { id: 1, name: 'Bitcoin', value: 34000 , collectionId: 1, favorite: true},
      { id: 2, name: 'Ethereum', value: 1800 , collectionId: 1, favorite: true },
      { id: 3, name: 'BNB', value: 200 , collectionId: 1, favorite: false },
      { id: 4, name: 'Random', value: 200 , collectionId: 2, favorite: false },
    ]);
  },
};
