let {COINS_DATA, COLLECTIONS_DATA} = require('../data/mock_data');

const getAll = () =>{
  return {count:COINS_DATA.length, items: COINS_DATA};
}

const getById = (id) => {
  return COINS_DATA.find((t) => t.id === id);
};

const create = ({ name, value, collectionId, favorite }) => {
  let existingCollection;
  if (collectionId) {
    existingCollection = COLLECTIONS_DATA.find((collection) => collection.id === collectionId);

    if (!existingCollection) {
      throw new Error(`There is no collection with id ${collectionId}.`);
    }
  }
  const maxId = Math.max(...COINS_DATA.map((i) => i.id));

  const newCoin = {
    id: maxId + 1,
    name,
    value,
    collectionId,
    favorite
  };
  COINS_DATA.push(newCoin);
  return newCoin;
};

const updateById = (id, {name, value, collectionId, favorite}) => {
  const index = COINS_DATA.findIndex(c => c.id === id);
  if (index === -1){
    throw new Error("Coin not found");
  }
  if (collectionId) {
    existingCollection = COLLECTIONS_DATA.find((collection) => collection.id === collectionId);

    if (!existingCollection) {
      throw new Error(`There is no collection with id ${collectionId}.`);
    }
  }
  const updatedCoin = {
    id,
    name,
    value,
    collectionId,
    favorite
  }
  COINS_DATA[index] = updatedCoin;
  return updatedCoin;
}

const deleteById = (id) => {
  COINS_DATA = COINS_DATA.filter(c => c.id != id);
}

module.exports = {getAll, create, getById, updateById, deleteById};