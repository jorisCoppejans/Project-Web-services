const { tables, getKnex } = require("../data/index");
const { getLogger } = require("../core/logging");

const SELECT_COLUMNS = [
  `${tables.coin}.id`,
  `${tables.coin}.name`,
  `${tables.coin}.value`,
  `${tables.coin}.collectionId`,
  `${tables.coin}.favorite`,
];

const formatCoin = ({id,name,value,collectionId,favorite}) => (
  {id, name, value, collectionId, favorite}
);

const getAll = async () => {
  return await getKnex()(tables.coin)
    .select(SELECT_COLUMNS)
    .orderBy("id", "ASC");
};

const getById = async (id) => {
  const coin = await getKnex()(tables.coin)
    .where(`${tables.coin}.id`, id)
    .first(SELECT_COLUMNS);
  return coin && formatCoin(coin);
};

const create = async ({name, value, collectionId, favorite, }) => {
  const highestId = await getKnex()(tables.coin)
    .where({collectionId})
    .max("id as maxId")
    .first();

  const nieuweId = (highestId && highestId.maxId) ? highestId.maxId + 1 : 1;

  const [id] = await getKnex()(tables.coin).insert({
    id: nieuweId,
    name,
    value,
    collectionId,
    favorite,
  });
  return id;
};

const updateById = async(id, {name, value, collectionId, favorite, }) =>{
  try{
    await getKnex()(tables.coin).update({
      name,
      value,
      collectionId,
      favorite,
    })
      .where (`${tables.coin}.id`, id);
    return id;
  } catch(error){
    getLogger().error("Error in updateById", {error});
    throw error;
  }
};

const deleteById = async (id) =>{
  try{
    const rowsAffected = await getKnex()(tables.coin)
      .where(`${tables.coin}.id`, id)
      .delete();

    return rowsAffected > 0;
  }catch(error){
    getLogger().error("Error in updateById", {error});
    throw error;
  }
};


module.exports = {getById, getAll, create, updateById, deleteById};
