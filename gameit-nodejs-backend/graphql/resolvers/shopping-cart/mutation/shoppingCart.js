/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( defs, fastify ) => {
  const {Mutation, ShoppingCartActions} = defs;
  
  //<editor-fold desc="Mutation actions">
  require('./shoppingCart/addItem')(defs, fastify);
  require('./shoppingCart/removeItem')(defs, fastify);
  //</editor-fold>
  
  Mutation.shoppingCart = () => ShoppingCartActions;
};
