const op = require('object-path');

// Utils
const RequestError = require('./../../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {ShoppingCartActions}, fastify ) => {
  const {ShoppingCart, Product, ProductType} = fastify.db.models;
  
  /**
   * @public
   * @async
   * (Mutation) Add item to user's shopping cart
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @returns {Promise<(Error|boolean)>}
   * @see Uses `@auth(role: [GUARDIAN])` directive
   */
  ShoppingCartActions.addItem = async ( root, {productId}, ctx ) => {
    const {id: userId} = fastify.user;
  
    /** @type {import('sequelize/types/model').Model&Product#} */
    const product = await Product.findById(productId, {
      attributes: ['coins'],
      include: [{model: ProductType, as: 'product_type', attributes: ['meta']}],
      raw: true,
    });
    
    if ( !product ) {
      throw new RequestError(ctx.request.t('This product is does not exist'), 'PRODUCT_NOT_EXIST');
    }
    
    if ( await ShoppingCart.userHasProduct({userId, productId}) ) {
      throw new RequestError(ctx.request.t('The product has already been added in to your cart'), 'ALREADY_IN_CART');
    }
    
    /** @type {import('sequelize/types/model').Model&ShoppingCart#} */
    const model = ShoppingCart.build();
    await model.loadDefaults();
    
    model.set({
      userId, productId,
    });
    model.setJsonValue('coins', +op.get(product, 'coins'));
    model.setJsonValue('type', op.get(product, ['product_type.meta', 'type']));
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await fastify.db.sequelize.transaction();
    
    try {
      // Save changes
      await model.save({transaction});
      
      // Write changes to DB
      await transaction.commit();
    } catch ( e ) {
      console.error(e.message, e);
      throw new RequestError(ctx.request.t('Failed to add a product to your cart'), 'PROCESS_FAILED');
    }
    
    return null;
  };
};
