const server = require('./app');
const config = require('./config/config');
const { seq: DB } = require('./sequelize');

DB.authenticate()
  .then(() => {
    server.listen(config.port, () => {
      console.log({
        type: 'success',
        message: 'Server and Database Connected',
        port: `Server running on port ${config.port}`,
      });
    });
  })
  .catch((err) => {
    console.log({
      type: 'danger',
      msg: 'Failed to connect to MySQL:',
      err: err.toString ? err.toString() : err,
    });
    process.exit(1);
  });
