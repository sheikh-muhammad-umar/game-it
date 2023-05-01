/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( defs, fastify ) => {
  const {Query, ShoppingCartQuery} = defs;
  
  //<editor-fold desc="Query queries">
  require('./shoppingCart/listItems')(defs, fastify);
  //</editor-fold>
  
  Query.shoppingCart = () => ShoppingCartQuery;
};
