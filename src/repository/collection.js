const { tables, getKnex } = require('../data/index');

const SELECT_COLUMNS = [
  `${tables.collection}.id`,
  `${tables.collection}.userId`,
  `${tables.collection}.id`,
  `${tables.coin}.id as coin_id`,
  `${tables.coin}.name as coin_name`,
  `${tables.coin}.value as coin_value`,
  `${tables.coin}.collectionId as coin_collectionId`,
  `${tables.coin}.favorite as coin_favorite`,
];

const formatCollection = ({
  id, 
  userId,
  coin_id,
  coin_name,
  coin_value,
  coin_collectionId,
  coin_favorite,
  ...rest
}) => ({
  ...rest,
  id: id,
  userId: userId,
  coins: {
    id: coin_id,
    name: coin_name,
    value : coin_value,
    collectionId : coin_collectionId,
    favorite : coin_favorite
  },
});

const { tables, getKnex } = require('../data/index');

const findAll = () => {
  return getKnex()(tables.collection)
    .select()
    .orderBy('name', 'ASC');
};

const findById = async (id) => {
  const collection = await getKnex()(tables.collection)
    .join(
      tables.coin,
      `${tables.coin}.collectionId`,
      '=',
      `${tables.collection}.id`
    )
    .where(`${tables.collection}.id`, id)
    .first(SELECT_COLUMNS);

  return collection && formatCollection(collection);
};

const create = async ({ id, userId, value }) => {
  const [id] = await getKnex()(tables.collection).insert({
    id, 
    userId, 
    value,
  });
  return id;
};

const updateById = async(id, {userId, value}) =>{
  const [id] = await getKnex()(tables.collection).insert({
    id, 
    userId, 
    value,
  });
  return id;
};

const deleteById = async (id) =>{
  return (tables.collection).where(`${tables.collection}.id`, id)
};


module.exports = {
  findById, findAll, create, updateById, deleteById
};
