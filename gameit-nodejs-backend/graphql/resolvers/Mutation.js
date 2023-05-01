/**
 * GraphQL Mutation
 */

/**
 * GraphQL Mutation context object
 * @typedef {Object|{[string]: any}} Mutation~GraphQLContext
 * @property {import('fastify/types/instance').FastifyInstance&FastifyServer} app - Fastify server instance
 * @property {import('fastify/types/reply').FastifyReply&FastifyResponse} reply - Fastify reply instance
 * @property {import('fastify/types/request').FastifyRequest&FastifyRequest} request - Fastify request instance
 */

/**
 * Mutation
 * @type {Object.<string, function(root<Object>, args<Object>, ctx<Mutation~GraphQLContext>, info<Object>): Object>}
 */
const Mutation = {};

module.exports = Mutation;
