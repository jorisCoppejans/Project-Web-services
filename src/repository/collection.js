const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

const SELECT_COLUMNS = [
  `${tables.collection}.id`,
  `${tables.collection}.userId`,
  `${tables.collection}.value`,
];

const formatCollection = ({
  id, 
  userId,
  ...rest
}) => ({
  ...rest,
  id: id,
  userId: userId,
});

const getAll = async () => {
  return await getKnex()(tables.collection)
    .select(SELECT_COLUMNS)
    .orderBy('id', 'ASC');
};


const getById = async (id) => {
  const collection = await getKnex()(tables.collection)
    .where(`${tables.collection}.id`, id)
    .select(SELECT_COLUMNS);

  if (Array.isArray(collection)) {
    // If it's an array, return the first element
    return collection.length > 0 ? formatCollection(collection[0]) : null;
  } else {
    // If it's not an array, assume it's an object and format accordingly
    return collection && formatCollection(collection);
  }
};


const create = async ({ userId }) => {
  const [id] = await getKnex()(tables.collection).insert({
    userId, 
    value : "0",
  });
  return id;
};

const updateById = async(id, {userId}) =>{
  try{
    await getKnex()(tables.collection).update({
      userId
    })
    .where (`${tables.collection}.id`, id);
    return id;
  } catch(error){
    getLogger().error('Error in updateById', {error});
    throw error;
  }
};

const deleteById = async (id) =>{
  try{
    const rowsAffected = await getKnex()(tables.collection)
    .where(`${tables.collection}.id`, id)
    .delete();

    return rowsAffected > 0;
  }catch(error){
    getLogger().error('Error in updateById', {error});
    throw error;
  }
};


module.exports = {
  getById, getAll, create, updateById, deleteById
};
