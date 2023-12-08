const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {

    const collectionIDs = await knex.select('id').from(tables.collection).pluck('id');
    await knex(tables.coin).whereIn('collectionId', collectionIDs).delete();


    const userIDs = await knex.select('id').from(tables.user).pluck('id');
    await knex(tables.collection).whereIn('userId', userIDs).delete();

    // Delete records from the users table
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        id: 1,
        firstname: 'Joris',
        lastname: 'Coppejans',
        email: 'joris.coppejans@yahoo.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER, Role.ADMIN]),
      },
      {
        id: 2,
        firstname: 'Stef',
        lastname: 'Roels',
        email: 'stef.roels@gmail.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        firstname: 'Robbe',
        lastname: 'Vervaet',
        email: 'robbe.vervaet@gmail.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
