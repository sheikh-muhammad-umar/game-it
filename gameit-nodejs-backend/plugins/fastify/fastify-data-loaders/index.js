/**
 * Fastify dataLoaders plugin
 */

const fp = require('fastify-plugin');

// Utils
const definitionsLoader = require('./definations');

module.exports = fp(
  /**
   * Fastify DataLoaders
   * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
   * @param {Object} opts - Plugin options
   * @param {function(): void} next - Next function
   */
  async ( fastify, opts, next ) => {
    if ( !fastify.hasReplyDecorator('dataLoaders') ) {
      const dataLoaders = definitionsLoader(fastify);
      fastify.decorate('dataLoaders', dataLoaders);
    }
    next();
  }, {
    name: 'fastify-data-loaders',
  });
