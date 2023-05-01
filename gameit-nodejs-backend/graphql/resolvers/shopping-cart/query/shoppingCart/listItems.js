const op = require('object-path');

// Utils
const graphqlFindOpts = require('../../../../../helpers/graphql/graphql-find-options');
const {recordsFetcher} = require('../../../../../helpers/graphql/pager-records-fetcher');
const {toGraphQLFilterMetaData} = require('../../../../../helpers/graphql/graphql-meta-utils');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {ShoppingCartQuery}, fastify ) => {
  const {ShoppingCart} = fastify.db.models;
  
  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = ( args, whereOptions ) => {
    const accessor = op(args.filters);
    
    // Implement logic here
  };
  
  /**
   * @public
   * @async
   * (ShoppingCartQuery) List cart items
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Query~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|Array<Object>>}
   * @see Uses `@auth(role: [GUARDIAN])` directive
   */
  ShoppingCartQuery.listItems = async ( root, args, ctx, info ) => {
    /** @type {Array<Object>} */
    const pager = graphqlFindOpts.parsePagerArg(args);
    
    /** @type {Array<string>} */
    const metaPaths = args.metaPaths || [];
    
    /** @type {number} */
    let limit = graphqlFindOpts.valueFromArgs('limit', pager, {
      default: 15, min: 1, max: 50,
    });
    
    /** @type {import('sequelize').WhereOptions} */
    const whereOptions = {
      userId: fastify.user.id,
    };
    
    applySearchFilters(args, whereOptions);
    
    const {language} = ctx.request;
    
    let sortOrder = graphqlFindOpts.parseSortOrder(args, {
      lang: language,
      callback ( column, order ) {
        if ( column === 'added_at' ) {
          // Set real column name
          column = 'created_at';
        }
        // Please note that order matters
        return [column, order];
      },
    });
    
    /** @type {ConnectionObject} */
    const response = graphqlFindOpts.emptyConnectionObject();
    
    const rows = await recordsFetcher(ShoppingCart, {
      limit, pager, response, sortOrder, whereOptions, info,
    });
    
    /** @type {Array<Object>} */
    response.nodes = [];
    
    for await ( let row of rows ) {
      const record = await ShoppingCart.toGraphObject(row, language);
      toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request});
      response.nodes.push(record);
    }
    
    return response;
  };
};
