
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  //<editor-fold desc="Query">
  require('./query/userRolesList')(defs, fastify);
  //</editor-fold>
  
  //<editor-fold desc="Mutation">
  require('./mutation/identity/signUp')(defs, fastify);
  require('./mutation/identity/sendVerificationCode')(defs, fastify);
  require('./mutation/identity/verifyAndActivateUserAccount')(defs, fastify);
  //</editor-fold>
};
