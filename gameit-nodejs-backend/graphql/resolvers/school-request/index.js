
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
	// Initialize type def
	defs.SchoolJoinRequest = {};
	defs.User = {};
	
	//<editor-fold desc="Mutation">
	require('./mutation/joinSchoolRequest')(defs, fastify);
	require('./mutation/discardSchoolRequest')(defs, fastify);
	require('./mutation/resendJoinSchoolRequest')(defs, fastify);
	//</editor-fold>
	
	//<editor-fold desc="Query">
	require('./query/listSchoolJoinRequests')(defs, fastify);
	//</editor-fold>
	
	//<editor-fold desc="Types">
	require('./types/user')(defs, fastify);
	require('./types/school')(defs, fastify);
	//</editor-fold>
};
