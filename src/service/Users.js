let {USER_DATA} = require('../data/mock_data');

const getAll = () => {
  return {count: USER_DATA.length, items: USER_DATA};
}

const getById = (id) => {
  return USER_DATA.find((t) => t.id === id);
};

const create = ({ firstname, lastname, email, password }) => {
  if (email) {
    existingUser = USER_DATA.find((user) => user.email === email);

    if (existingUser) {
      throw new Error(`There is already a user with email ${email}.`);
    }
  }

  const maxId = Math.max(...USER_DATA.map((i) => i.id));

  const newUser = {
    id: maxId + 1,
    firstname, 
    lastname, 
    email, 
    password
  };
  USER_DATA.push(newUser);
  return newUser;
};

const updateById = (id, { firstname, lastname, email, password }) => {
  const index = USER_DATA.findIndex((user) => user.id === id);
  
  if (index === -1) {
    throw new Error('User not found');
  }

  if (email) {
    const existingUserIndex = USER_DATA.findIndex((user) => user.email === email);
    if (existingUserIndex !== -1 && existingUserIndex !== index) {
      throw new Error(`There is already a user with email ${email}.`);
    }
  }

  const updatedUser = {
    id,
    firstname,
    lastname,
    email,
    password
  }

  USER_DATA[index] = updatedUser;
  return updatedUser;
};


const deleteById = (id) => {
  USER_DATA = USER_DATA.filter(u => u.id != id);
}


module.exports = {getAll, create, getById, updateById, deleteById};