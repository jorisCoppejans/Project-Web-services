const usersRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');


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
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  return user;
};

const create = async ({ firstname, lastname, email, password }) => {
  try {
    const passwordHash = await hashPassword(password);

    const id = await usersRepository.create({
      firstname,
      lastname,
      email,
      passwordHash,
      roles: ['user'],
    });

    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, { firstname, lastname, email, password, roles }) => {
  if (email) {
    const users = await usersRepository.getAll();
    const emails = users.map(u => u.email);

    if (email in emails){
      throw ServiceError.validationFailed(`There is already a user with email: ${email}.`, { email });
    }
  }
  await usersRepository.updateById(id, {firstname, lastname, email, password, roles});
  return getById(id);
};


const deleteById = async (id) => {
  const deleted = await usersRepository.deleteById(id);

  if (!deleted){
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }
}


module.exports = {getAll, create, getById, updateById, deleteById};