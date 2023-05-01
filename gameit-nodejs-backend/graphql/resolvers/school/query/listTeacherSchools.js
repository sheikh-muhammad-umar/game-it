
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
  const {School, TeacherSchool} = fastify.db.models;
  const {getTokenFromAll, findIdentityByToken} = JWTIdentity(fastify);
  
  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = ( args, whereOptions ) => {
    const accessor = op(args.filters);
    
    accessor.has('countryCode')
      && (whereOptions['meta.countryCode'] = {[Op.eq]: accessor.get('countryCode')})
    
    accessor.has('name')
      && (whereOptions.name = {[Op.like]: `%${accessor.get('name')}%`})
    
    accessor.has('city')
      && (whereOptions['meta.city'] = {[Op.like]: `%${accessor.get('city')}%`})
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
  Query.listTeacherSchools = async ( root, args, ctx, info ) => {

    /** @type {Array<Object>} */
    const pager = graphqlFindOpts.parsePagerArg(args);
    const userId = fastify.user.id;
    
    /** @type {Array<string>} */
    const metaPaths = args.metaPaths || [];
    /** @type {number} */
    let limit = graphqlFindOpts.valueFromArgs('limit', pager, {
      default: 15, min: 1, max: 50,
    });

    const joinedSchools = await TeacherSchool.findAll({
      where: {
        teacherId: userId,
        'meta.permission': "GRANTED",
      },
      attributes: ['schoolId'],
      raw: true,
    });

    const schoolIDs  = joinedSchools.map( (ele) => {
      return ele.schoolId
    });

    console.log("schoolIDs: ", schoolIDs)
    
    const createdSchools = await School.findAll({
      where: {
        ownerId: userId,
        isActive: true,
      },
      attributes: ['id'],
      raw: true,
    });
    
    createdSchools.map( (ele) => {
      schoolIDs.push(ele.id);
    } );
    console.log("createdSchools: ", createdSchools)
    console.log("schoolIDs: ", schoolIDs)
    
    /** @type {import('sequelize').WhereOptions} */
    const whereOptions = {
      id: schoolIDs,
      isActive: true,
    };
  
    applySearchFilters(args, whereOptions);
    
    const {language} = ctx.request;
    
    let sortOrder = graphqlFindOpts.parseSortOrder(args, {
      lang: language,
    });
    
    /** @type {ConnectionObject} */
    const response = graphqlFindOpts.emptyConnectionObject();
    
    const rows = await recordsFetcher(School, {
      limit, pager, response, sortOrder, whereOptions, info,
    });
  
    /** @type {Array<Object>} */
    response.nodes = [];
     for await (let row of rows) {
        const record = await School.toGraphObject(row, language);
        record.isOwner = userId && userId === record.meta.ownerId;
        toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request})
        response.nodes.push(record);
       }
    
    return response;
  };
};
