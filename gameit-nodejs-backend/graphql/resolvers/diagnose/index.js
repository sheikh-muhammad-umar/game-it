
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
 module.exports = ( defs, fastify ) => {
    //<editor-fold desc="Query">
    require('./query/diagnoses')(defs, fastify);
    //</editor-fold>
  };
  