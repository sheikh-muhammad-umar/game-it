
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = function ( defs, fastify ) {
	// Initialize type def
	defs.ShoppingCartActions = {};
	defs.ShoppingCartQuery = {};
	
	//<editor-fold desc="Mutation">
	require('./mutation/shoppingCart')(defs, fastify);
	//</editor-fold>
	
	//<editor-fold desc="Mutation">
	require('./query/shoppingCart')(defs, fastify);
	//</editor-fold>
	
	//<editor-fold desc="Query">
	//require('./query/listSchoolJoinRequests')(defs, fastify);
	//</editor-fold>
	
	//<editor-fold desc="Types">
	
	//</editor-fold>
};
