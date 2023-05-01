/** Fastify data loader definitions */

const glob = require('glob');

/**
 * Fastify Data loaders
 * @class FastifyDataLoader
 * @mixes UsersDataLoader
 * @mixes SchoolsDataLoader
 * @mixes ProductTypesDataLoader
 */

/**
 * @param {import('fastify/types/instance').FastifyInstance} fastify - Fastify instance
 * @return {Object}
 */
module.exports = ( fastify ) => {
  /** @type {Object} */
  const dataLoaders = {};
  
  /** @type {Array<string>} */
  const factories = glob.sync(`${__dirname}/factories/**/*.js`);
  
  factories.forEach(file => {
    require(file)(fastify, dataLoaders);
  })
  
  return dataLoaders;
}
