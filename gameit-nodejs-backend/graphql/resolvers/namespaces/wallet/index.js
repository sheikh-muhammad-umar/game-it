
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  // Initialize type def
  // defs.Wallet = {};

  //<editor-fold desc="Mutation">
  // require('./mutation')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Query">
  // require('./query')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Types">
  // require('./types')(defs, fastify);
  //</editor-fold>
};
