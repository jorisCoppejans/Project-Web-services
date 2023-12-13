const supertest = require("supertest");

const createServer = require("../../src/createServer");
const packageJson = require("../../package.json");

describe("Health", () => {
  let server;
  let request;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = "/api/health";


  describe("GET /api/health/ping", () => {
    it("should return pong", async () => {
      const response = await request.get(`${url}/ping`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        pong: true,
      });
    });

  });

  describe("GET /api/health/version", () => {
    it("should return version from package.json", async () => {
      const response = await request.get(`${url}/version`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        env: "test",
        version: packageJson.version,
        name: packageJson.name,
      });
    });

  });

  describe("General", () => {

    it("should return 404 when accessing invalid url", async () => {
      const response = await request.get("/invalid");

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: "NOT_FOUND",
        message: "Unknown resource: /invalid",
      });
    });
  });
});