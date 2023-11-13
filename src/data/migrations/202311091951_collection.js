const {tables} = require('../index');

module.exports = {
  up: async(knex) =>{
    await knex.schema.createTable(tables.collection, (table) => {
      table.increments("id").unsigned().notNullable();
      table.string("userId", 255).unsigned().notNullable();
      table.float("value").unsigned().notNullable();

      table
        .foreign('userId', 'fk_collection_user')
        .references(`${tables.user}.id`)
        .onDelete('CASCADE');
    })
  },

  down:(knex) =>{
    return knex.schema.dropTable(tables.collection);
  }
}