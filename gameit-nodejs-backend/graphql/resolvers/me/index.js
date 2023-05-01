
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
	// Initialize types def
	defs.Me = {};
	defs.Teacher = {};
	defs.Guardian = {};

	//<editor-fold desc="Mutation">
	require('./mutation/profile')(defs, fastify);
	//</editor-fold>

	//<editor-fold desc="Query">
	require('./query/me')(defs, fastify);
	//</editor-fold>

	//<editor-fold desc="Types">
	require('./types/teacher')(defs, fastify);
	require('./types/guardian')(defs, fastify);
	require('./types/schoolAdmin')(defs, fastify);
	//</editor-fold>
};
