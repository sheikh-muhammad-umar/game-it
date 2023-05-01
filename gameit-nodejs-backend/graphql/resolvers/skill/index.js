
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
 module.exports = ( defs, fastify ) => {
	// Initialize type def
	defs.Skill = {};

	//<editor-fold desc="Query">
	require('./query/listSkills')(defs, fastify);
	//</editor-fold>

};
