
const op = require('object-path');
const Op = require('sequelize').Op;

// Utils
const graphqlFindOpts = require('../../../../helpers/graphql/graphql-find-options');
const {recordsFetcher} = require('../../../../helpers/graphql/pager-records-fetcher');
const {toGraphQLFilterMetaData} = require('../../../../helpers/graphql/graphql-meta-utils');
const JWTIdentity = require('../../../../helpers/fastify/auth/jwt-identity');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Query}, fastify ) => {
  const {GuardianInvitation} = fastify.db.models;
  const {getTokenFromAll, findIdentityByToken} = JWTIdentity(fastify);

  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = ( args, whereOptions ) => {
    const accessor = op(args.filters);

    accessor.has('email')
      && (whereOptions.email = {[Op.eq]: accessor.get('email')})

    accessor.has('studentId')
      && (whereOptions.studentId = {[Op.eq]: accessor.get('studentId')})

    accessor.has('classroomId')
      && (whereOptions.classroomId = {[Op.eq]: accessor.get('classroomId')})

    if ( accessor.has('status') ) {
      if ( accessor.get('status') === 'PENDING' ) {
        whereOptions.status = 10
      }
      if ( accessor.get('status') === 'GRANTED' ) {
        whereOptions.status = 3
      }
    }
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
  Query.listGuardianInvitations = async ( root, args, ctx, info ) => {

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
      // isActive: true,
    };

    applySearchFilters(args, whereOptions);

    const {language} = ctx.request;

    let sortOrder = graphqlFindOpts.parseSortOrder(args, {
      lang: language,
    });

    /** @type {ConnectionObject} */
    const response = graphqlFindOpts.emptyConnectionObject();

    const rows = await recordsFetcher(GuardianInvitation, {
      limit, pager, response, sortOrder, whereOptions, info,
    });

    /** @type {Array<Object>} */
    response.nodes = [];
     for await (let row of rows) {
        const record = await GuardianInvitation.toGraphObject(row, language);
        toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request})
        response.nodes.push(record);
       }

    return response;
  };
};
