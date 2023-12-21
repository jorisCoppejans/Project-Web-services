const coinsRepository = require("../repository/coin");
const ServiceError = require("../core/serviceError");
const collectionRepository = require("../repository/collection");
const apiCoinsRepository = require("../repository/apicoin");

const handleDBError = require("./_handleDBError");

const getAll = async () =>{
  let coins = await coinsRepository.getAll();

  const apiCoins = await apiCoinsRepository.getAll();

  coins = coins.map((coin) => {
    const value = apiCoins.find((c) => c.name === coin.name).value;

    return {id: coin.id, name: coin.name, value: value, collectionId:coin.collectionId, favorite: coin.favorite};
  });

  return {
    count: coins.length,
    items: coins,
  };
};

const getById = async (id) => {
  const coin = await coinsRepository.getById(id);

  if (!coin){
    throw ServiceError.notFound(`No coin with id ${id} exists`, { id });
  }

  return coin;
};

const create = async ({ name, value, collectionId, favorite }) => {
  const existingCollection = await collectionRepository.getById(collectionId);

  if (!existingCollection){
    throw ServiceError.notFound(`There is no collection with id ${collectionId}.`, { collectionId });
  }

  try {
    const id = await coinsRepository
      .create({
        name,
        value,
        collectionId,
        favorite
      });

    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, {name, value, collectionId, favorite}) => {
  if (collectionId) {
    const existingCollection = await collectionRepository.getById(collectionId);

    if (!existingCollection) {
      throw ServiceError.notFound(`There is no collection with id ${id}.`, { id });
    }
    await coinsRepository.updateById(id, {name, value, collectionId, favorite});
    return getById(id);
  }
};

const deleteById = async (id) => {
  const deleted = await coinsRepository.deleteById(id);

  if (!deleted){
    throw ServiceError.notFound(`No coin with id ${id} exists`, { id });
  }
};


module.exports = {getAll, create, getById, updateById, deleteById};