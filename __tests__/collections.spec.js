const supertest = require('supertest');
const createServer = require('../src/createServer');
const {getKnex, tables} = require('../src/data');

describe('Collection', () => {
  let server;
  let request;
  let knex;

  const data = {
    transactions: [{
      id: 1,
      user_id: 1,
      place_id: 1,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      user_id: 1,
      place_id: 1,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      user_id: 1,
      place_id: 1,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    }],
    places: [{
      id: 1,
      name: 'Test place',
      rating: 3,
    }],
    users: [{
      id: 1,
      name: 'Test User'
    }]
  };

  const dataToDelete = {
    transactions: [1, 2, 3],
    places: [1],
    users: [1]
  };
  
  

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  })

  afterAll(async () => {
    await server.stop();
  })

  const url = '/api/collections'

  describe('GET /api/collections', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collection);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    })

    it('should return 200 and all collections', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.items[1]).toEqual({
        id: 3,
        user: {
          id: 1,
          name: 'Test User',
        },
        place: {
          id: 1,
          name: 'Test place',
        },
        amount: -74,
        date: new Date(2021, 4, 21, 14, 30).toJSON(),
      });
      expect(response.body.items[2]).toEqual({
        id: 1,
        user: {
          id: 1,
          name: 'Test User',
        },
        place: {
          id: 1,
          name: 'Test place',
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    })
  })

  describe('Collections', () => {
    // ...
  
    describe('POST /api/collections', () => {
      const transactionsToDelete = []; // 👈 2
  
      // 👇 1
      beforeAll(async () => {
        await knex(tables.place).insert(data.places);
        await knex(tables.user).insert(data.users);
      });
  
      afterAll(async () => {
        // 👇 2
        await knex(tables.transaction)
          .whereIn('id', transactionsToDelete)
          .delete();
  
        // 👇 1
        await knex(tables.place)
          .whereIn('id', dataToDelete.places)
          .delete();
  
        // 👇 3
        await knex(tables.user)
          .whereIn('id', dataToDelete.users)
          .delete();
      });

      //testen
      it('should 201 and return the created transaction', async () => {
        // 👇 1
        const response = await request.post(url)
          .send({
            amount: 102,
            date: '2021-05-27T13:00:00.000Z',
            placeId: 1,
            userId: 1,
          });
      
        expect(response.status).toBe(201); // 👈 2
        expect(response.body.id).toBeTruthy(); // 👈 3
        expect(response.body.amount).toBe(102); // 👈 4
        expect(response.body.date).toBe('2021-05-27T13:00:00.000Z'); // 👈 4
        expect(response.body.place).toEqual({  // 👈 4
          id: 1,
          name: 'Test place',
        });
        expect(response.body.user).toEqual({ // 👈 5
          id: 1,
          name: 'Test User'
        });
      
        // 👇 6
        transactionsToDelete.push(response.body.id);
      });
      
    });
  });  
})