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
    firstname: 'Joris',
    lastname: 'Coppejans',
    email: 'joris.coppejans@yahoo.com',
    password: 'abcd1234'
  },
  {
    id : 5,
    firstname: 'Stef',
    lastname: 'Roels',
    email: 'stef.roels@gmail.com',
    password: 'abcd1234'
  },
  {
    id : 6,
    firstname: 'Robbe',
    lastname: 'Vervaet',
    email: 'robbe.vervaet@gmail.com',
    password: 'abcd1234'
  },]
};

const url = '/api/users'

const dataToDelete = {
  collections: [1, 2],
  users: [4, 5, 6]
};

describe('Users', () => {
  
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  })

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/users', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    })

    it('should return 200 and all users', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.items[0]).toEqual({
        id : 4,
        firstname: 'Joris',
        lastname: 'Coppejans',
        email: 'joris.coppejans@yahoo.com',
        password: 'abcd1234'
      });
      expect(response.body.items[1]).toEqual({
        id : 5,
        firstname: 'Stef',
        lastname: 'Roels',
        email: 'stef.roels@gmail.com',
        password: 'abcd1234'
      });
      expect(response.body.items[2]).toEqual({
        id : 6,
        firstname: 'Robbe',
        lastname: 'Vervaet',
        email: 'robbe.vervaet@gmail.com',
        password: 'abcd1234'
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });


  describe('GET /api/users/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.collection).insert(data.collections);
    })

    afterAll(async () => {
      await knex(tables.collection).whereIn('id', dataToDelete.collections).delete();
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/4`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id : 4,
        firstname: 'Joris',
        lastname: 'Coppejans',
        email: 'joris.coppejans@yahoo.com',
        password: 'abcd1234'
      });
    });

    it('should 404 when requesting not existing user', async () => {
      const response = await request.get(`${url}/7`);
  
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

    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  
  describe('POST /api/users', () => { 
    const usersToDelete = [] 
    afterAll(async () => {
      await knex(tables.user).whereIn('id', usersToDelete).delete();
    });
  
    it('should 201 and return the created user', async () => {
      const response = await request.post(url).send({
        firstname: 'Robbe2',
        lastname: 'Vervaet2',
        email: 'robbe.vervaet@gmail.com2',
        password: 'abcd12342'
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.firstname).toBe('Robbe2');
      expect(response.body.lastname).toBe('Vervaet2');
      expect(response.body.email).toBe('robbe.vervaet@gmail.com2');
      expect(response.body.password).toBe('abcd12342');
  
      usersToDelete.push(response.body.id);
    });

    it('should 400 when missing firstname', async () => {
      const response = await request.post(url)
        .send({
          lastname: "coppejans", 
          email: "test@test.com", 
          password: "abc123"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing lastname', async () => {
      const response = await request.post(url)
        .send({
          firstname: "joris",
          email: "test@test.com", 
          password: "abc123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing email', async () => {
      const response = await request.post(url)
        .send({
          firstname: "joris",
          lastname: "coppejans", 
          password: "abc123",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing password', async () => {
      const response = await request.post(url)
        .send({
          firstname: "joris",
          lastname: "coppejans", 
          email: "test@test.com",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });
  });


  describe('PUT /api/users/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    afterAll(async () => {
      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          firstname: 'UserChange',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id : 4,
        firstname: 'UserChange',
        lastname: 'Coppejans',
        email: 'joris.coppejans@yahoo.com',
        password: 'abcd1234'
      });
    });
  });


  describe('DELETE /api/users/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
    });

    afterAll(async () => {
      await knex(tables.user).whereIn('id', dataToDelete.users).delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/4`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/7`);

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

    it('should 400 with invalid user id', async () => {
      const response = await request.delete(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});  
