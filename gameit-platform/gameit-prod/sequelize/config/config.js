const op = require('object-path');

// Inject .env file variables
require('dotenv').config({path: __dirname + '/../../.env'});

/** @type {objectPath~ObjectPathBound} */
const env = op(process.env);

/**
 * Generic configuration
 * @type {import('sequelize').Options}
 */
const configuration = {
  host: env.get('DATABASE_HOST', 'localhost'),
  username: env.get('DATABASE_USERNAME', 'root'),
  password: env.get('DATABASE_PASSWORD', ''),
  database: env.get('DATABASE_DB1', 'gameit-pf'),
  port: env.get('DATABASE_PORT', 3306),
  dialect: 'mysql',
  logQueryParameters: true,
  benchmark: true,
  logging: false
}

module.exports = {
  development: configuration,
  test: configuration,
  production: configuration,
};
