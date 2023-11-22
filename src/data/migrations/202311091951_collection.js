const { tables } = require('../index');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTableIfNotExists(tables.collection, (table) => {
      table.increments('id').unsigned().notNullable();
      table.integer('userId').unsigned().notNullable();
      table.float('value', 8, 2).unsigned().notNullable();
    })
  },

  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.collection);
  }
}
