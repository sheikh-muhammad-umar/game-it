const op = require('object-path');
const Op = require('sequelize').Op;

// Utils
const graphqlFindOpts = require('../../../../helpers/graphql/graphql-find-options');
const {recordsFetcher} = require('../../../../helpers/graphql/pager-records-fetcher');
const {toGraphQLFilterMetaData} = require('../../../../helpers/graphql/graphql-meta-utils');
const {gameStats} = require('../../../../helpers/game-stats');

const objectPath = require('object-path');
const { indexOf } = require('lodash');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Query}, fastify) => {
  const {Game, GameSession, StudentGame, Student, UserGame, User} = fastify.db.models;
  
  
  /**
   * Apply search filters to main query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {import('sequelize').WhereOptions} whereOptions=[] - Attribute whereOptions
   */
  const applySearchFilters = (args, whereOptions) => {
    const accessor = op(args.filters);

    accessor.has('studentId')
    && (whereOptions.studentId = {[Op.eq]: `${accessor.get('studentId')}`})
  
    accessor.has('gameId')
    && (whereOptions.gameId = {[Op.eq]: `${accessor.get('gameId')}`})

    accessor.has('type')
    && (whereOptions.type = {[Op.eq]: `${accessor.get('type')}`})

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
  Query.listGameSessions = async (root, args, ctx, info) => {
    const userId = fastify.user.id;

    /** @type {Array<Object>} */
    const pager = graphqlFindOpts.parsePagerArg(args);
    /** @type {objectPath~ObjectPathBound} */
    const filters = op(args.filters || {});

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
    const include = [];

//    const rows = await recordsFetcher(GameSession, {
 //     limit, pager, response, sortOrder, whereOptions, info, include
  //  });

    /** @type {Array<Object>} */
    const rows = await GameSession.findAll({
      attributes: ['id', 'studentId', 'gameId', 'type', 'data'],
      whereOptions,
      order: [['id', 'ASC']],
      raw: true,
    });

    /** @type {Array<Object>} */
    const game = await Game.findOne({
      where: {
        id: filters.get('gameId'),
      },
      attributes: ['levels'],
      raw: true,
    });
    
    console.log(gameStats(game, rows));
    response.nodes = gameStats(game, rows);
    response.totalCount=response.nodes.length;
    
    return response;

    response.nodes = [];
    /** @type {Array<Object>} */
    for await (const row of rows) {
      const record = await GameSession.toGraphObject(row, language);

      toGraphQLFilterMetaData(metaPaths, record, {request: ctx.request})
      response.nodes.push(record);
    }
    return response;
  };
};
