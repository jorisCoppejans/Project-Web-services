const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.user).delete();

    // then add the fresh places
    await knex(tables.user).insert([
      { id: 1, firstname: 'Joris', lastname: 'Coppejans', email: 'joris.coppejans@yahoo.com', password: 'abcd1234'},
      { id: 2, firstname: 'Stef', lastname: 'Roels', email: 'stef.roels@gmail.com', password: 'abcd1234'},
      { id: 3, firstname: 'Robbe', lastname: 'Vervaet', email: 'robbe.vervaet@gmail.com', password: 'abcd1234'},
    ]);
  },
};
