// Utils
const RequestError = require('./../../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {ShoppingCartActions}, fastify ) => {
  const {ShoppingCart} = fastify.db.models;
  
  /**
   * @public
   * @async
   * (Mutation) Remove a product to shopping cart
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @returns {Promise<(Error|boolean)>}
   * @see Uses `@auth(role: [GUARDIAN])` directive
   */
  ShoppingCartActions.removeItem = async ( root, {itemId}, ctx ) => {
    const {id: userId} = fastify.user;
    
    /** @type {number} */
    const hasItemInCart = await ShoppingCart.count({
      where: {id: itemId, userId},
    });
    
    if ( !hasItemInCart ) {
      throw new RequestError(ctx.request.t('No such item in your shopping cart'), 'NO_ITEM_IN_CART');
    }
    
    if ( !(await ShoppingCart.destroy({where: {id: itemId, userId}})) ) {
      throw new RequestError(ctx.request.t('Unable to remove product from cart'), 'FAILED_TO_REMOVE');
    }
  };
};
