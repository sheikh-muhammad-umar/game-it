/**
 * Fastify requests rate limiter
 * In case a client reaches the maximum number of allowed requests, an error will be sent to the user with the status code set to 429
 */

/** Native/Installed modules */
const fp = require('fastify-plugin');

/**
 * Register a main function
 */
async function main ( fastify, opts, next ) {
	/** @type {number} */
	const max = process.env.CONNECTION_RATE_LIMITER_MAX_REQUESTS || 10000;

	/** @type {number} */
	const mins = process.env.CONNECTION_RATE_LIMITER_TIME_WINDOW || 60;

	/** @type {number} */
	const timeWindow = (/** 1000 * 60 */ 60000) * mins;

	// Limit requests/s rate
	fastify.register(require('fastify-rate-limit'), {
		max,
		timeWindow,
		redis: fastify.redis,
	});

	next();
}

// Export plugin to module
module.exports = fp(main, {
	name: 'fastify-rate-limit'
});
