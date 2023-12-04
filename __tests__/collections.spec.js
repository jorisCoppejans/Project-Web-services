const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getKnex, tables } = require('../src/data');

let server;
let request;
let knex;

const data = {
  collections: [
    {
      id: 1,
      userId: 4,
      value: 100000,
    },
    {
      id: 2,
      userId: 5,
      value: 200.25,
    },
  ],
  users: [
    {
      id: 4,
      firstname: 'Joris',
      lastname: 'Coppejans',
      email: 'joris.coppejans@yahoo.com',
      password: 'abcd1234',
    },
    {
      id: 5,
      firstname: 'Stef',
      lastname: 'Roels',
      email: 'stef.roels@gmail.com',
      password: 'abcd1234',
    },
    {
      id: 6,
      firstname: 'Robbe',
      lastname: 'Vervaet',
      email: 'robbe.vervaet@gmail.com',
      password: 'abcd1234',
    },
  ],
};

const url = '/api/collections';

const dataToDelete = {
  collections: [1, 2],
  users: [4, 5, 6],
};

describe('Collection', () => {
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/collections', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    });

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should return 200 and all collections', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.items[0]).toEqual({
        id: 1,
        userId: 4,
        value: 100000,
      });
      expect(response.body.items[1]).toEqual({
        id: 2,
        userId: 5,
        value: 200.25,
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });


  describe('GET /api/collections/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    });

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the requested collection', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        userId: 4,
        value: 100000, 
      });
    });

    it('should 404 when requesting not existing collection', async () => {
      const response = await request.get(`${url}/4`);
  
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No collection with id 4 exists',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid collection id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });


  describe('POST /api/collections', () => {
    const collectionsToDelete = [];

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', collectionsToDelete).delete();
    });

    it('should 200 and return the created collection', async () => {
      const response = await request.post(url).send({
        userId: 4,
        value: 0,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.userId).toBe(4);
      expect(response.body.value).toBe(0);

      collectionsToDelete.push(response.body.id);
    });

    it('should 404 when user does not exist', async () => {
      const response = await request.post(url)
        .send({
          userId: 7,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing user', async () => {
      const response = await request.post(url)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });
  });

  describe('PUT /api/collections/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    });

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the updated collection', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          userId: 5,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        value: 100000,
        userId: 5
      });
    });

    it('should 404 when user does not exist', async () => {
      const response = await request.post(url)
        .send({
          userId: 7,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
  });


  describe('DELETE /api/collections/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    });

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/2`);
      
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing collection', async () => {
      const response = await request.delete(`${url}/3`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No collection with id 3 exists',
        details: {
          id: 3,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid collection id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});
