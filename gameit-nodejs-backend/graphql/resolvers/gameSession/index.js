
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
 module.exports = ( defs, fastify ) => {
	// Initialize type def
	defs.GameSession = {};

	//<editor-fold desc="Query">
	require('./query/listGameSessions')(defs, fastify);
	//</editor-fold>

	

};
