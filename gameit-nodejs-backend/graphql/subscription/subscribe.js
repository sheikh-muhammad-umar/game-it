/**
 * Graphql subscription subscribe utils
 */

const { RedisPubSub } = require('graphql-redis-subscriptions');

/**
 * @constructor
 * @param {FastifyInstance&FastifyServer} fastify fastify instance
 */
module.exports = fastify => {
	/**
	 * Pubsub Subscription instance
	 * @kind Object
	 */
	const pubSub = new RedisPubSub({connection: fastify.config.get('redis', {})});
	
	/*pubsub.asyncAuthIterator = ( messages, authPromise ) => {
		const asyncIterator = pubsub.asyncIterator(messages);
		
		return {
			next() {
				return authPromise.then(() => asyncIterator.next());
			},
			return() {
				return authPromise.then(() => asyncIterator.return());
			},
			throw(error) {
				return asyncIterator.throw(error);
			},
			[$$asyncIterator]() {
				return asyncIterator;
			},
		};
	};*/
	
	return ({
		pubSub,
	});
};
