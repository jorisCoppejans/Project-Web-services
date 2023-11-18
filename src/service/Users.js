const usersRepository = require('../repository/user');

const getAll = async () => {
  const users = await usersRepository.getAll();
  return {
    count: users.length,
    items: users,
  };
};

const getById = async (id) => {
  const user = await usersRepository.getById(id);

  if (!user){
    throw Error(`No user with id ${id} exists`, {id});
  }

  return user;
};

const create = async ({ firstname, lastname, email, password }) => {
  if (email) {
    const users = await usersRepository.getAll();
    const emails = users.map(u => u.email);

    if (email in emails){
      throw Error(`There is already a user with email ${email}.`, {email});
    }
  }

  const id = await usersRepository.create({ firstname, lastname, email, password });
  return await getById(id);
};

const updateById = async (id, { firstname, lastname, email, password }) => {
  if (email) {
    const users = await usersRepository.getAll();
    const emails = users.map(u => u.email);

    if (email in emails){
      throw new Error(`There is already a user with email ${email}.`, {email});
    }
  }
  await usersRepository.updateById(id, {firstname, lastname, email, password});
  return getById(id);
};


const deleteById = async (id) => {
  const deleted = await usersRepository.deleteById(id);

  if (!deleted){
    throw Error(`No user with id ${id} exists`, {id})
  }
}


module.exports = {getAll, create, getById, updateById, deleteById};