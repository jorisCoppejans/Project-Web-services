const {tables} = require('../index');

module.exports = {
  up: async(knex) =>{
    await knex.schema.createTable(tables.user, (table) => {
      table.increments("id");
      table.string("firstname", 255).notNullable();
      table.string("lastname", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("password", 255).notNullable();
    })
  },

  down:(knex) =>{
    return knex.schema.dropTable(tables.user);
  }
}