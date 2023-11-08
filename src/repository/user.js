const { tables, getKnex } = require('../data/index');


const formatUser = ({
  id,
  firstname,
  lastname,
  email,
  password,

  collectionId, 
  userId,
  
  coin_id,
  coin_name,
  coin_value,
  coin_collectionId,
  coin_favorite,
  ...rest
}) => ({
  ...rest,
  id: id,
  firstname,
  lastname,
  email,
  password,

  collection : {
    collectionId: collectionId,
    userId: userId,

    coins: {
      id: coin_id,
      name: coin_name,
      value : coin_value,
      collectionId : coin_collectionId,
      favorite : coin_favorite
    },
  }
});


const findAll = () => {
  return getKnex()(tables.user)
    .select()
    .orderBy('name', 'ASC');
};

const findById = async (id) => {
  const user = await getKnex()(tables.user)
    .join(
      tables.collection,
      `${tables.collection}.userId`,
      '=',
      `${tables.user}.id`
    )
    .join(
      tables.coin,
      `${tables.coin}.collectionId`,
      '=',
      `${tables.collection}.id`
    )
    .where(`${tables.collection}.userId`, id)
    .first(SELECT_COLUMNS);

  return user && formatUser(user);
};

const create = async ({ id, firstname, lastname, email, password, }) => {
  const [id] = await getKnex()(tables.user).insert({
    id, 
    firstname,
    lastname,
    email,
    password,
  });
  return id;
};

const updateById = async(id, {firstname, lastname, email, password,}) =>{
  const [id] = await getKnex()(tables.user).insert({
    id, 
    firstname,
    lastname,
    email,
    password,
  });
  return id;
};

const deleteById = async (id) =>{
  return (tables.user).where(`${tables.user}.id`, id)
};


module.exports = {
  findById, findAll, create, updateById, deleteById
};
