const supertest = require('supertest');
const createServer = require('../src/createServer');
const {getKnex, tables} = require('../src/data');

let server;
let request;
let knex;

const data = {
  collections: [{
    id : 1,
    userId : 4,
    value : 100000
  },
  {
    id : 2,
    userId : 5,
    value : 200.25
  }],
  users: [{
    id : 4,
    firstName: 'Joris',
    lastName: 'Coppejans',
    email: 'joris.coppejans@yahoo.com',
    password: 'abcd1234'
  },
  {
    id : 5,
    firstName: 'Stef',
    lastName: 'Roels',
    email: 'stef.roels@gmail.com',
    password: 'abcd1234'
  },
  {
    id : 6,
    firstName: 'Robbe',
    lastName: 'Vervaet',
    email: 'robbe.vervaet@gmail.com',
    password: 'abcd1234'
  },]
};

const url = '/api/collections'

const dataToDelete = {
  collections: [1, 2],
  users: [4, 5, 6]
};

describe('Collection', () => {
  
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  })

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/collections', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    })

    it('should return 200 and all collections', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.items[0]).toEqual({
        id : 1,
        userId : 4,
        value : 100000
      });
      expect(response.body.items[1]).toEqual({
        id : 2,
        userId : 5,
        value : 200.25
      });
    })
  });
  
  describe('POST /api/transactions', () => {
    const collectionsToDelete = []; // 👈 2
    // 👇 1
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
    });

    afterAll(async () => {
      // 👇 2
      await knex(tables.collection)
        .whereIn('id', collectionsToDelete)
        .delete();

      // 👇 3
      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });
    it('should 200 and return the created collection', async () => {
      // 👇 1
      const response = await request.post(url)
        .send({
          userId: 4,
          value: 0
        });
    
      expect(response.status).toBe(200); // 👈 2
      expect(response.body.id).toBeTruthy(); // 👈 3
      expect(response.body.userId).toBe(4); // 👈 4
      expect(response.body.value).toBe(0); // 👈 4
          
      // 👇 6
      collectionsToDelete.push(response.body.id);
    });
  });
});  
