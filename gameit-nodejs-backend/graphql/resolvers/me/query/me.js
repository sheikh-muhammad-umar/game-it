/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Query}, fastify ) => {
	/**
	 * @public
	 * @async
	 * (Query) Current user data
	 * @param {Object} root - The object that contains the result returned from the resolver on the parent field
	 * @param {Object} args - The arguments passed into the field in the query
	 * @param {Query~GraphQLContext} ctx - Fastify reply instance
	 * @param {Object} info - It contains information about the execution state of the query
	 * @returns {Promise<Error|boolean>}
	 * @see Uses `@auth` directive
	 */
	Query.me = async ( root, args, ctx, info ) => {
		const {User} = fastify.db.models;
		const { /** @type {User#} */ identity} = fastify.user;
		return await User.toGraphMeObject(identity);
	};
};
