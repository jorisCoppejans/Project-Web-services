// const { tables } = require('..');

// module.exports = {
//   seed: async (knex) => {
//     // first delete all entries
//     await knex(tables.user).delete();

//     // then add the fresh places
//     await knex(tables.user).insert([
//       { id: 1, firstname: 'Joris', lastname: 'Coppejans', email: 'joris.coppejans@yahoo.com', password: 'abcd1234'},
//       { id: 2, firstname: 'Stef', lastname: 'Roels', email: 'stef.roels@gmail.com', password: 'abcd1234'},
//       { id: 3, firstname: 'Robbe', lastname: 'Vervaet', email: 'robbe.vervaet@gmail.com', password: 'abcd1234'},
//     ]);
//   },
// };


const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        id: 1,
        firstname: 'Joris',
        lastname: "Coppejans",
        email: 'joris.coppejans@yahoo.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify(['user', 'admin']),
      },
      {
        id: 2,
        firstname: 'Stef',
        lastname: 'Roels',
        email: 'stef.roels@gmail.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify(['user']),
      },
      {
        id: 3,
        firstname: 'Robbe',
        lastname: 'Vervaet',
        email: 'robbe.vervaet@gmail.com',
        password:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify(['user']),
      },
    ]);
  },
};
