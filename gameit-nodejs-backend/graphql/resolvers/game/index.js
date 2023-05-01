
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
 module.exports = ( defs, fastify ) => {
	// Initialize type def
	defs.Game = {};

	//<editor-fold desc="Query">
	require('./query/listGames')(defs, fastify);
	//</editor-fold>

	//<editor-fold desc="Types">
	require('./types/student')(defs, fastify);
	//</editor-fold>

};
