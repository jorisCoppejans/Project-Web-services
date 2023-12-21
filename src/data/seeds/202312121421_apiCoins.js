const axios = require("axios");

const { tables } = require("..");

// Definieer de seedData functie
const seedData = async () => {
  const key = "F4A8E0F9-B258-4EA9-9250-542E978ECD97";

  // Haal de wisselkoersen op van de externe API
  const response = await axios.get(`https://rest.coinapi.io/v1/exchangerate/EUR?apikey=${key}`);
  const rates = response.data.rates;

  const apiCoins = rates.sort((a, b) => b.rate - a.rate).slice(60, 80).map((rate) => ({
    name: rate.asset_id_quote,
    value: parseFloat(rate.rate)
  }));

  console.log(apiCoins);
  return apiCoins;
};

// Exporteer zowel de seedData als de seed functies
module.exports = {
  seedData,
  seed: async (knex) => {
    await knex(tables.apicoin).delete();

    // Voer de seedData-functie uit om gegevens in te voegen in de 'apiCoin' tabel
    const apiCoins = await seedData(knex);

    // Voeg andere gegevens toe aan de 'coin' tabel zoals nodig
    await knex(tables.apicoin).insert(apiCoins);
  },
};
