const supertest = require('supertest');
const createServer = require('../src/createServer');
const {getKnex, tables} = require('../src/data');
const Role = require('../src/core/roles');


let server;
let request;
let knex;

const data = {
  coins: [{
    id: 1,
    name: 'Bitcoin',
    value: 34000,
    collectionId: 1,
    favorite: true,
  },
  {
    id: 2,
    name: 'Ethereum',
    value: 1800,
    collectionId: 1,
    favorite: true, 
  },
  {
    id: 3,
    name: 'BNB',
    value: 200,
    collectionId: 1,
    favorite: false, 
  },
  {
    id: 4,
    name: 'Random',
    value: 200,
    collectionId: 2,
    favorite: false, 
  }],
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
    firstname: 'Joris',
    lastname: 'Coppejans',
    email: 'joris.coppejans@yahoo.com',
    password: 'abcd1234',
    roles: '["admin"]'
  },
  {
    id : 5,
    firstname: 'Stef',
    lastname: 'Roels',
    email: 'stef.roels@gmail.com',
    password: 'abcd1234',
    roles: '["user"]'
  },
  {
    id : 6,
    firstname: 'Robbe',
    lastname: 'Vervaet',
    email: 'robbe.vervaet@gmail.com',
    password: 'abcd1234',
    roles: '["user"]'
    },
  ]
};

const convertToBoolean = (value) => {
  return value === 1 ? true : false;
};

const url = '/api/coins'

const dataToDelete = {
  coins: [1, 2, 3, 4],
  collections: [1, 2],
  users: [4, 5, 6]
};

describe('Coin', () => {
  
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  })

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/coins', () => {
    beforeAll(async () => {
      await knex(tables.coin).insert(data.coins);
      await knex(tables.collection).insert(data.collections);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.coin).whereIn('id', dataToDelete.coins).delete();
    })

    it('should return 200 and all coins', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(4);

      response.body.items[0].favorite = convertToBoolean(response.body.items[0].favorite);
      expect(response.body.items[0]).toEqual({
        id: 1,
        name: 'Bitcoin',
        value: 34000,
        collectionId: 1,
        favorite: true,
      });

      response.body.items[1].favorite = convertToBoolean(response.body.items[1].favorite);
      expect(response.body.items[1]).toEqual({
        id: 2,
        name: 'Ethereum',
        value: 1800,
        collectionId: 1,
        favorite: true, 
      });

      response.body.items[2].favorite = convertToBoolean(response.body.items[2].favorite);
      expect(response.body.items[2]).toEqual({
        id: 3,
        name: 'BNB',
        value: 200,
        collectionId: 1,
        favorite: false, 
      });

      response.body.items[3].favorite = convertToBoolean(response.body.items[3].favorite);
      expect(response.body.items[3]).toEqual({
        id: 4,
        name: 'Random',
        value: 200,
        collectionId: 2,
        favorite: false, 
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/coins/:id', () => {
    beforeAll(async () => {
      await knex(tables.coin).insert(data.coins);
      await knex(tables.collection).insert(data.collections);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.coin).whereIn('id', dataToDelete.coins).delete();
    })

    it('should 200 and return the requested coin', async () => {
      const response = await request.get(`${url}/4`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 4,
        name: 'Random',
        value: 200,
        collectionId: 2,
        favorite: false, 
      });
    });

    it('should 404 when requesting not existing coin', async () => {
      const response = await request.get(`${url}/7`);
  
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No coin with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid coin id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
  
  describe('POST /api/coins', () => {
    const coinsToDelete = [];

    afterAll(async () => {
      await knex(tables.coin).whereIn('id', coinsToDelete).delete();
    });

    it('should 201 and return the created coins', async () => {
      const response = await request.post(url).send({
        name: 'Test',
        value: 500,
        collectionId: 2,
        favorite: true, 
      });
    
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Test');
      expect(response.body.value).toBe(500);
      expect(response.body.collectionId).toBe(2);
      expect(response.body.favorite).toBe(true);
          
      coinsToDelete.push(response.body.id);
    });

    it('should 404 when collection does not exist', async () => {
      const response = await request.post(url)
        .send({
          name: "test",
          value: 123, 
          collectionId: 7, 
          favorite: false
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No collection with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(url)
        .send({
          value: 123, 
          collectionId: 1, 
          favorite: false,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing value', async () => {
      const response = await request.post(url)
        .send({
          name: "test", 
          collectionId: 1, 
          favorite: false,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing collection', async () => {
      const response = await request.post(url)
        .send({
          name: "test", 
          value: 123, 
          favorite: false,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing favorite', async () => {
      const response = await request.post(url)
        .send({
          name: "test", 
          collectionId: 1, 
          value: 123,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });
  });


  describe('PUT /api/coins/:id', () => {

    beforeAll(async () => {
      await knex(tables.coin).insert(data.coins);
      await knex(tables.collection).insert(data.collections);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.coin).whereIn('id', dataToDelete.coins).delete();
    })

    it('should 200 and return the updated coin', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          name: 'CoinChange',
          value : 159,
          collectionId : 2,
          favorite : true
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 4,
        name: 'CoinChange',
        value : 159,
        collectionId : 2,
        favorite : true
      });
    });

    it('should 404 when collection does not exist', async () => {
      const response = await request.post(url)
        .send({
          name: "test",
          value: 123, 
          collectionId: 7, 
          favorite: false
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No collection with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });


  describe('DELETE /api/coins/:id', () => {
    beforeAll(async () => {
      await knex(tables.coin).insert(data.coins);
      await knex(tables.collection).insert(data.collections);
    });

    afterAll(async () => {
      await knex(tables.coin).whereIn('id', dataToDelete.coins).delete();
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/4`);
      
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing coin', async () => {
      const response = await request.delete(`${url}/5`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No coin with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid coin id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});  
