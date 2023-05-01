/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Query}, fastify ) => {
  const {User} = fastify.db.models;
  
  /**
   * @public
   * @async
   * (Query) List countries
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Query~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|Array<Object>>}
   */
  Query.userRolesList = async ( root, args, ctx, info ) => {
    const nodes = Object.values(User.getRoles(true)).map(name => ({
      name
    }));
    
    return {
      totalCount: nodes.length,
      nodes,
    };
  };
};
