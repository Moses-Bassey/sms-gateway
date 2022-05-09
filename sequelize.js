const Sequelize = require('sequelize');
const config = require('./config/config');

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    timezone: '+01:00',
    logging: false,
  },
);

const seq = sequelize;
const Op = Sequelize.Op;

module.exports = {
  seq,
  Op,
};
