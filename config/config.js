require('dotenv').config();

const {
  POSTGRES_USER,
  NODE_ENV,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_NAME,
  JWT_SECRET_KEY,
  PORT,
} = process.env;

module.exports = {
  appEnv: NODE_ENV,
  port: PORT || 2022,
  database: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_NAME,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    dialect: 'postgres',
  },
  auth: {
    secret: JWT_SECRET_KEY,
  },
  geoSpatial: {
    searchRadiusMeters: 10,
  },
};
