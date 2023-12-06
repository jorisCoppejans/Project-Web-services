const collectionsRepository = require('../repository/collection');
const usersRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');


const getAll = async () => {
  const collections = await collectionsRepository.getAll();
  return {
    count: collections.length,
    items: collections,
  };
};

const getById = async (id) => {
  const collection = await collectionsRepository.getById(id);

  if (!collection){
    //throw Error(`No collection with id ${id} exists`, {id});
    throw ServiceError.notFound(`No collection with id ${id} exists`, { id });
  }

  return collection;
};

const create = async ({ userId }) => {
  try {
    const id = await collectionsRepository
    .create({
      userId
    });

    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, {userId}) => {
  if (userId) {
    const existingUser = await usersRepository.getById(userId);

    if (!existingUser) {
      //throw new Error(`There is no user with id ${userId}.`, {userId});
      throw ServiceError.notFound(`There is no user with id ${id}.`, { id });
    }
  }
  await collectionsRepository.updateById(id, {id, userId,});
  return getById(id);
}

const deleteById = async (id) => {
  const deleted = await collectionsRepository.deleteById(id);

  if (!deleted){
    throw ServiceError.notFound(`No collection with id ${id} exists`, { id });
  }
}

module.exports = {getAll, create, getById, updateById, deleteById};