const coinsRepository = require('../repository/coin');
const {COLLECTIONS_DATA} = require('../data/mock_data')

const getAll = async () =>{
  const coins = await coinsRepository.getAll();
  return {
    count: coins.length,
    items: coins,
  };
};

const getById = async (id) => {
  const coin = await coinsRepository.getById(id);

  if (!coin){
    throw Error(`No coin with id ${id} exists`, {id});
  }

  return coin;
};

const create = async ({ name, value, collectionId, favorite }) => {
  const id = await coinsRepository.create({  name, value, collectionId, favorite });
  return await getById(id);
};

const updateById = async (id, {name, value, collectionId, favorite}) => {
  if (collectionId) {
    existingCollection = COLLECTIONS_DATA.find((collection) => collection.id === collectionId);

    if (!existingCollection) {
      throw new Error(`There is no collection with id ${collectionId}.`);
    }
  await coinsRepository.updateById(id, {name, value, collectionId, favorite});
  return getById(id);
  }
}

const deleteById = async (id) => {
  const deleted = await coinsRepository.deleteById(id);

  if (!deleted){
    throw Error(`No coin with id ${id} exists`, {id})
  }
}

module.exports = {getAll, create, getById, updateById, deleteById};