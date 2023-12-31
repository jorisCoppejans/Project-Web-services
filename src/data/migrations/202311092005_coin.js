const {tables} = require("../index");

module.exports = {
  up: async(knex) =>{
    await knex.schema.createTableIfNotExists(tables.coin, (table) => {
      table.increments("id").unsigned().notNullable();
      table.string("name", 255).notNullable();
      table.float("value").unsigned().notNullable();
      table.integer("collectionId").unsigned().notNullable();
      table.boolean("favorite").notNullable();

      table.foreign("collectionId").references("id").inTable(tables.collection).onDelete("CASCADE");
    });
  },

  down:(knex) =>{
    return knex.schema.dropTable(tables.coin);
  }
};