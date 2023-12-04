const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
const { hashPassword, verifyPassword } = require('../core/password');
const Role = require('../core/roles');
const { getLogger } = require('../core/logging');
const { generateJWT, verifyJWT } = require('../core/jwt');


const getAll = async () => {
  const users = await userRepository.getAll();
  return {
    count: users.length,
    items: users,
  };
};

const getById = async (id) => {
  const user = await userRepository.getById(id);

  if (!user){
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  return user;
};

const create = async ({ firstname, lastname, email, password }) => {
  try {
    const passwordHash = await hashPassword(password);

    const id = await userRepository.create({
      firstname,
      lastname,
      email,
      passwordHash,
      roles: [Role.USER],
    });

    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, { firstname, lastname, email, password, roles }) => {
  if (email) {
    const users = await userRepository.getAll();
    const emails = users.map(u => u.email);

    if (email in emails){
      throw ServiceError.validationFailed(`There is already a user with email: ${email}.`, { email });
    }
  }
  await userRepository.updateById(id, {firstname, lastname, email, password, roles});
  return getById(id);
};


const deleteById = async (id) => {
  const deleted = await userRepository.deleteById(id);

  if (!deleted){
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }
};

const register = async ({firstname, lastname, email, password}) => {
  try {
    const passwordHash = await hashPassword(password);

    const userId = await userRepository.create({
      firstname,
      lastname,
      email,
      password: passwordHash,
      roles: [Role.USER],
    });
    return await userRepository.getById(userId);
  } catch (error) {
    throw handleDBError(error);
  }
};

const makeExposedUser = ({ id, firstname, lastname, email, roles }) => ({
  id,
  firstname,
  lastname,
  email,
  roles,
});


const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  const passwordValid = await verifyPassword(password, user.password);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  return await makeLoginData(user);
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  } 

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {userId, roles, authToken};
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    );
  }
};


module.exports = {getAll, create, getById, updateById, deleteById, login, register, checkAndParseSession, checkRole};