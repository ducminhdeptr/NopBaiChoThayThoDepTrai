const mssql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_HOST || "localhost",
  // Nếu SQL Server của bạn dùng cổng khác 1433, hãy set DB_PORT tương ứng trong .env
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
  database: process.env.DB_NAME || "coffee_shop",
  options: {
    encrypt: false, // với localhost/SQL Server local thì disable encrypt
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const poolPromise = new mssql.ConnectionPool(config);

module.exports = {
  poolPromise,
  sql: mssql,
};
