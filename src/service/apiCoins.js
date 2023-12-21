const apiCoinsRepository = require("../repository/apicoin");


const getAll = async () =>{
  const apiCoins = await apiCoinsRepository.getAll();
  console.log(apiCoins);

  return {
    count: apiCoins.length,
    items: apiCoins,
  };
};



module.exports = {getAll};