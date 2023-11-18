const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.user}.id`,
  `${tables.user}.firstname`,
  `${tables.user}.lastname`,
  `${tables.user}.email`,
  `${tables.user}.password`,
];


const formatUser = ({
  id,
  firstname,
  lastname,
  email,
  password,
  ...rest
}) => ({
  ...rest,
  id: id,
  firstname,
  lastname,
  email,
  password,
});


const getAll = async () => {
  const users = await getKnex()(tables.user)
  .select(SELECT_COLUMNS)
  .orderBy('lastname', 'ASC');
  return users
};


const getById = async (id) => {
  const user = await getKnex()(tables.user)
    .where(`${tables.user}.id`, id)
    .first(SELECT_COLUMNS);

  return user && formatUser(user);
};

const create = async ({ firstname, lastname, email, password, }) => {
  const [id] = await getKnex()(tables.user).insert({
    firstname,
    lastname,
    email,
    password,
  });
  return id;
};

const updateById = async(id, {firstname, lastname, email, password,}) =>{
  try{
    await getKnex()(tables.user).update({
      firstname,
      lastname,
      email,
      password,
    })
    .where (`${tables.user}.id`, id);
    return id;
  } catch(error){
    getLogger().error('Error in updateById', {error});
    throw error;
  }
};

const deleteById = async (id) =>{
  try{
    const rowsAffected = await getKnex()(tables.user)
    .where(`${tables.user}.id`, id)
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
