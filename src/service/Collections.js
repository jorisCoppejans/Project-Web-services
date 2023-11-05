let {COLLECTIONS_DATA, USER_DATA} = require('../data/mock_data');

const getAll = () =>{
  return {count:COLLECTIONS_DATA.length, items: COLLECTIONS_DATA};
}

const getById = (id) => {
  return COLLECTIONS_DATA.find((t) => t.id === id);
};

const create = ({ userId, value }) => {
  let existingUser;
  if (userId) {
    existingUser = USER_DATA.find((user) => user.id === userId);

    if (!existingUser) {
      throw new Error(`There is no user with id ${userId}.`);
    }
  }
  const maxId = Math.max(...COLLECTIONS_DATA.map((i) => i.id));

  const newCollection = {
    id: maxId + 1,
    userId,
    value
  };
  COLLECTIONS_DATA.push(newCollection);
  return newCollection;
};

const updateById = (id, {userId, value}) => {
  const index = COLLECTIONS_DATA.findIndex(c => c.id === id);
  if (index === -1){
    throw new Error("Collection not found");
  }
  if (userId) {
    existingUser = USER_DATA.find((user) => user.id === userId);

    if (!existingUser) {
      throw new Error(`There is no user with id ${userId}.`);
    }
  }
  const updatedCollection = {
    id,
    userId,
    value
  }
  COLLECTIONS_DATA[index] = updatedCollection;
  return updatedCollection;
}

const deleteById = (id) => {
  COLLECTIONS_DATA = COLLECTIONS_DATA.filter(c => c.id != id);
}

module.exports = {getAll, create, getById, updateById, deleteById};