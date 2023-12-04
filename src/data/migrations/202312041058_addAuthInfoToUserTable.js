const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.user, (table) => {
      table.string('password').notNullable();
      table.jsonb('roles').notNullable();
      table.unique('email', 'idx_user_email_unique');
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.user, (table) => {
      table.dropColumns('email', 'password', 'roles');
    });
  },
};
