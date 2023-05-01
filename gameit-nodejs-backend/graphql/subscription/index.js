/**
 * GraphQL subscriptions helper
 */

// Types
const {USER_LOGOUT} = require('./types/authenticate/auth');

/**
 * @typedef SubscriptionOutput
 * @type {Object}
 * @property {Object} pubSub - Pub-sub instance
 * @property {string} USER_LOGOUT
 */

/**
 * @constructor
 * @param {FastifyInstance&FastifyServer} fastify fastify instance
 * @return {SubscriptionOutput}
 */
module.exports = fastify => {
	const {pubSub} = require('./subscribe')(fastify);
	
	return {
		pubSub,
		
		// authenticate/auth
		USER_LOGOUT,
	};
};
