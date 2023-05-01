/**
 * Fastify server
 */

'use strict';

/** Native/Installed modules */
require('dotenv').config();

// Utils
const isDev = process.env.NODE_ENV !== 'production';
const fastifyInitializer = require('./fastify/bootstrapper');

// Environment related
const {
	SERVER_ADDRESS = '127.0.0.1',
	SERVER_PORT = '3000',
} = process.env;

// Server initializer and kick starter
(async () => {
	// Create and initialize fastify instance
	const fastify = await fastifyInitializer();
	
	try {
		await fastify.listen(SERVER_PORT, SERVER_ADDRESS);
	} catch ( err ) {
		isDev && console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}
})();
