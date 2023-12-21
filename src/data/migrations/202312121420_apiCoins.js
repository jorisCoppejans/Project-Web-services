const {tables} = require("../index");

module.exports = {
  up: async(knex) =>{
    await knex.schema.createTableIfNotExists(tables.apicoin, (table) => {
      table.string("name", 255).notNullable();
      table.decimal("value", 30, 8).unsigned().notNullable();
    });
  },

  down:(knex) =>{
    return knex.schema.dropTable(tables.apicoin);
  }
};