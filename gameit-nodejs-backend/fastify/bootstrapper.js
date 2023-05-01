/**
 * Fastify server bootstrapper
 */

const {
	SERVER_LOGGING = 'false',
} = process.env;

/**
 * Fastify server instance
 * @typedef FastifyServer
 * @property {FastifySequelize} db - Database instance
 * @property {FastifyJwt} jwt - JWT instance
 * @property {FastifyIdentity} user - User identifier
 */
module.exports = async () => {
	//<editor-fold desc="Fastify server/middleware configuration">
	// Require the framework and instantiate it
	/** @type {import('fastify/types/instance').FastifyInstance} */
	const fastify = require('fastify')({
		// Access log in console (comment following line to skip)
		logger: SERVER_LOGGING !== 'false',
		// Max JSON body request size in MB
		bodyLimit: 2 * (1024 * 1024),
	});

	// express like middleware handler
	await fastify.register(require('fastify-express'));
	
	fastify
		//<editor-fold desc="Middleware">
		.use(require('x-xss-protection')())
		//</editor-fold>
		
		//<editor-fold desc="Custom plugins">
		.register(require('./../plugins/fastify/fastify-cors'))
		.register(require('./../plugins/fastify/fastify-rate-limit'))
		//</editor-fold>
		
		//<editor-fold desc="Native plugins">
		.register(require('fastify-favicon'))
		.register(require('fastify-accepts'))
		.register(require('fastify-url-data'))
		.register(require('fastify-cookie'))
		.register(require('fastify-formbody'))
		.after(err => {
			if ( err ) throw err;
		})
		//</editor-fold>
		
		//<editor-fold desc="Custom plugins">
		.register(require('./../plugins/fastify/fastify-sequelize'))
		.register(require('./../plugins/fastify/fastify-data-loaders'))
		.register(require('./../plugins/fastify/fastify-auth-decorator'))
		//.register(require('./../plugins/fastify/fastify-session'))
		.register(require('./../plugins/fastify/fastify-jwt'))
		.register(require('./../plugins/fastify/fastify-i18n'))
		//.register(require('./../plugins/fastify/fastify-auth-decorator'))

		.register(require('./../plugins/fastify/graphql/fastify-apollo-server'))
		//.register(require('./../plugins/fastify/graphql/fastify-apollo-subscription'))
		.register(require('./../plugins/fastify/fastify-auto-routes'))
		.register(require('./../plugins/fastify/fastify-modules'))
		
		.after(function (err) {
			if ( err ) throw err;
		})
	//</editor-fold>
	;
	//</editor-fold>
	
	// Export as public
	return fastify;
};
