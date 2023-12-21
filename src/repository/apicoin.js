const { tables, getKnex } = require("../data/index");

const SELECT_COLUMNS = [
  `${tables.apicoin}.name`,
  `${tables.apicoin}.value`,
];

const formatapicoin = ({name,value}) => (
  {name, value}
);

const getAll = async () => {
  return await getKnex()(tables.apicoin)
    .select(SELECT_COLUMNS);
};

const getById = async (name) => {
  const apicoin = await getKnex()(tables.apicoin)
    .where(`${tables.apicoin}.name`, name)
    .first(SELECT_COLUMNS);
  return apicoin && formatapicoin(apicoin);
};

module.exports = {getById, getAll};
