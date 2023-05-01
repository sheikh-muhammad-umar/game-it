
const op = require('object-path');
const Op = require('sequelize').Op;

// Utils
const graphqlFindOpts = require('../../../../helpers/graphql/graphql-find-options');
const {recordsFetcher} = require('../../../../helpers/graphql/pager-records-fetcher');
const {toGraphQLFilterMetaData} = require('../../../../helpers/graphql/graphql-meta-utils');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Query}, fastify ) => {
  const {School, TeacherSchool} = fastify.db.models;
  
  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = ( args, whereOptions ) => {
    const accessor = op(args.filters);
    
    accessor.has('teacherId')
      && (whereOptions.teacherId = {[Op.eq]: accessor.get('teacherId')})
    
    accessor.has('schoolId')
      && (whereOptions.schoolId = {[Op.eq]: accessor.get('schoolId')})
    
    accessor.has('status')
    && (whereOptions['meta.permission'] = {[Op.eq]: accessor.get('status')})
  };
  
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
  Query.listSchoolJoinRequests = async ( root, args, ctx, info ) => {
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
    };
  
    applySearchFilters(args, whereOptions);
    
    const {language} = ctx.request;
    
    let sortOrder = graphqlFindOpts.parseSortOrder(args, {
      lang: language,
    });
    
    /** @type {ConnectionObject} */
    const response = graphqlFindOpts.emptyConnectionObject();
    
    const rows = await recordsFetcher(TeacherSchool, {
      limit, pager, response, sortOrder, whereOptions, info,
    });
  
    /** @type {Array<Object>} */
    response.nodes = rows.map(row => {
      const record = TeacherSchool.toGraphObject(row, language);
      toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request});
      return record;
    })
    
    return response;
  };
};
