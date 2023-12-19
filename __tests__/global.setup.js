const config = require("config");

const { initializeLogger } = require("../src/core/logging");
const Role = require("../src/core/roles");
const { initializeData, getKnex, tables } = require("../src/data");


module.exports = async () => {

  initializeLogger({
    level: config.get("log.level"),
    disabled: config.get("log.disabled"),
  });
  await initializeData();

  const knex = getKnex();

  await knex(tables.user).insert([
    {
      id: 5,
      firstname: "Test",
      lastname: "User",
      email: "test.user@hogent.be",
      password_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU", 
      //is 12345678
      roles: JSON.stringify([Role.USER])
    },
    {
      id: 4,
      firstname: "Admin",
      lastname: "User",
      email: "admin.user@hogent.be",
      password_hash:
        "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
      roles: JSON.stringify([Role.ADMIN, Role.USER])
    },
  ]);
};
