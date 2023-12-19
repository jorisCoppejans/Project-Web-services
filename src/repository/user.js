const { tables, getKnex } = require("../data/index");
const { getLogger } = require("../core/logging");

const SELECT_COLUMNS = [
  `${tables.user}.id`,
  `${tables.user}.firstname`,
  `${tables.user}.lastname`,
  `${tables.user}.email`,
  `${tables.user}.password`,
];


const formatUser = ({id, firstname, lastname, email, password, ...rest}) => (
  {...rest, id, firstname, lastname, email, password}
);


const getAll = async () => {
  const users = await getKnex()(tables.user)
    .select(SELECT_COLUMNS)
    .orderBy("lastname", "ASC");
  return users;
};


const getById = async (id) => {
  const user = await getKnex()(tables.user)
    .where(`${tables.user}.id`, id)
    .first(SELECT_COLUMNS);

  return user && formatUser(user);
};

const create = async ({ firstname, lastname, email, password, roles }) => {
  try{  
    const [id] = await getKnex()(tables.user).insert({
      firstname,
      lastname,
      email,
      password,
      roles: JSON.stringify(roles),
    });
    return id;
  }catch (error) {
    getLogger().error("Error in create", {
      error,
    });
    throw error;
  }
};

const updateById = async(id, {firstname, lastname, email, password, roles}) =>{
  try{
    await getKnex()(tables.user).update({
      firstname,
      lastname,
      email,
      password,
      roles,
    })
      .where (`${tables.user}.id`, id);
    return id;
  } catch(error){
    getLogger().error("Error in updateById", {error});
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
    getLogger().error("Error in updateById", {error});
    throw error;
  }
};

const findByEmail = (email) => {
  return getKnex()(tables.user).where("email", email).first();
};


module.exports = {getById, getAll, create, updateById, deleteById, findByEmail};
