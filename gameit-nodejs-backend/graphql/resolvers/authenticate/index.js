/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
	//<editor-fold desc="Mutation">
	require('./mutation/login')(defs, fastify);
	require('./mutation/logout')(defs, fastify);
	
	// Identity related
	require('./mutation/password/changePassword')(defs, fastify);
	require('./mutation/password/resetPasswordRequest')(defs, fastify);
	require('./mutation/password/verifyCodeAndResetPassword')(defs, fastify);
	//</editor-fold>
};
