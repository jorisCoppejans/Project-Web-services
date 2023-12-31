module.exports = {
  logging :{
    level:"silly",
    disabled : false
  },
  port: 9000,
  cors: {
    origins: ["http://localhost:5173"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "project",
    username: "root",
    password: "",
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: "eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked",
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: "budget.hogent.be",
      audience: "budget.hogent.be",
    },
  },
};