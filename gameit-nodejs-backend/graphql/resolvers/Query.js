/**
 * GraphQL Query
 */

/**
 * GraphQL context object
 * @typedef {Object} Query~GraphQLContext
 * @property {import('fastify/types/instance').FastifyInstance&FastifyServer} app - Fastify server instance
 * @property {import('fastify/types/reply').FastifyReply&FastifyResponse} reply - Fastify reply instance
 * @property {import('fastify/types/request').FastifyRequest&FastifyRequest} request - Fastify request instance
 */

/**
 * Query
 * @type {Object.<string, function(root<Object>, args<Object>, ctx<Query~GraphQLContext>, info<Object>): Object>}
 */
const Query = {};

module.exports = Query;
