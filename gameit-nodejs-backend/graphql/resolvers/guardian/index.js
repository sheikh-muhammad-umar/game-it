
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  // Initialize type def
	defs.GuardianInvitation = {};

  //<editor-fold desc="Query">
  require('./query/listGuardians')(defs, fastify);
  //</editor-fold>
  
  //<editor-fold desc="Mutation">
  require('./mutation/identity/guardianInvitation')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Types">
  require('./types/classroom')(defs, fastify);
  require('./types/student')(defs, fastify);
  //</editor-fold>
};
