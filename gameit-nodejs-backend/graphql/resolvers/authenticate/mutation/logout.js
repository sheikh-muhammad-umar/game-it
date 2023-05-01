
// Utils
const UserAuth = require('../../../../helpers/fastify/auth/authenticate');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation, Subscription}, fastify ) => {
	const {clearAuthCookie} = UserAuth(fastify);
	
	/**
	 * @public
	 * @async
	 * (Mutation) Logout current user
	 * @param {Object} root - The object that contains the result returned from the resolver on the parent field
	 * @param {Object} args - The arguments passed into the field in the query
	 * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
	 * @param {Object} info - It contains information about the execution state of the query
	 * @returns {Promise<Error|boolean>}
	 * @see Uses `@auth` directive
	 */
	Mutation.logout = async ( root, args, ctx, info ) => {
		const {request, reply} = ctx;
		
		const {identity} = fastify.user;
		
		// Clear cookies
		clearAuthCookie(request, reply);
		
		// Invalidate token
		identity.generateAuthKey();
		await identity.save();
		
		return true;
	};
};
