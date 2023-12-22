const apiCoinsRepository = require("../repository/apicoin");


const getAll = async () =>{
  const apiCoins = await apiCoinsRepository.getAll();

  return {
    count: apiCoins.length,
    items: apiCoins,
  };
};



module.exports = {getAll};