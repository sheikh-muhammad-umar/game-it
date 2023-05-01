/**
 * Fastify routes definition file autoloader
 */

/** Native/Installed modules */
const fp = require('fastify-plugin');
const glob = require('glob');
const path = require('path');

// Utils
const Path = require('./../../../utils/core/path');

/**
 * Fastify request
 * @extends fastify#FastifyRequest
 * @class FastifyRequest
 * @property {{[string]: *}} query - The parsed querystring
 * @property {{[string]: *}} params - The params matching the URL
 * @property {{[string]: string}} headers - The headers
 * @property {{[string]: *}} cookies - Cookies
 * @property {string} id - The request id
 * @property {Object} log - The logger instance of the incoming request
 *
 * @property {Array<string>} languages - List ISO codes (ee-FF)
 * @property {Array<string>} regions - List of ISO codes (ee-FF)
 * @property {string} language - Request language (ee-FF)
 * @property {string} region - Request region language (ee-FF)
 * @property {string} locale - Request local iso code (ee-FF)
 */

/**
 * Fastify response
 * @class FastifyResponse
 * @mixes FastifyReply
 * @mixes i18nAPI
 * @property {Response} res The http.ServerResponse from Node core
 * @property {FastifyInstance} context The http.ServerResponse from Node core
 */

/**
 * Send a cookie, defines a cookie to be sent along with the rest of the HTTP headers.
 * @see https://github.com/fastify/fastify-cookie
 * @name FastifyResponse#setCookie
 * @function
 * @memberof FastifyResponse
 * @param {string} name A string name for the cookie to be set
 * @param {string} value A string value for the cookie
 * @param {CookieSerializeOptions} options - An options object as described in the cookie `serialize` documentation
 * @returns {FastifyResponse} - Fastify reply instance
 */

/**
 * Plugin handler
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Additional options
 * @param {function(): void} next - Function to continue fastify lifecycle
 */
module.exports = fp(async ( fastify, opts, next ) => {
	const basePath = Path.normalize(`${__dirname}/../../../`);
	
	/**
	 * Controllers files
	 * @type {string[]}
	 */
	const controllers = [
		/**
		 * +-----------------------------+
		 * | Global Controllers (routes) |
		 * +-----------------------------+
		 */
		...glob.sync(`${basePath}/controllers/**/*.controller.js`),
	];
	
	try {
		// Load controllers
		controllers.forEach(file => {
			fastify.register(require(Path.normalize(file)), opts);
		});
	} catch (err) {
		throw err;
	}

	next();
}, {
	name: 'fastify-auto-routes',
});
