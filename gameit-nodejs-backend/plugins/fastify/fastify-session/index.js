/**
 * Fastify session plugin
 */

const fp = require('fastify-plugin');

// Export plugin to module
module.exports = fp(async ( fastify, opts, next ) => {
	fastify.register(require('@fastify/session'), {
		secret: process.env.SESSION_SERVER_SECRET,
	});
	
	fastify.addHook('preHandler', (request, reply, next) => {
		request.session.destroy(next);
	});
	
	fastify.addHook('onSend', async (request, reply) => {
		reply.header('X-Session-ID', request.session.sessionId);
	});
	
	next();
}, {
	name: 'fastify-session',
});
