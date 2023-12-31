const { shutdownData, getKnex, tables } = require("../src/data");


module.exports = async () => {
  await getKnex()(tables.coin).delete();
  await getKnex()(tables.collection).delete();
  await getKnex()(tables.user).delete();

  await shutdownData();
};
