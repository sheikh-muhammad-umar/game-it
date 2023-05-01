const url = require('url')

/**
 * Friendly CORS Fastify Plugin
 */

/** Native/Installed modules */
const fp = require('fastify-plugin');

/**
 * @private
 * Get origin from request
 * @param {FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {string} origin - Request origin
 * @return {string}
 */
const getOrigin = ( fastify, origin ) => {
	// Set true when non-browser request
	if ( !origin ) {
		return true;
	}
	
	const {hostname} = url.parse(origin);
	
	/**
	 * Whitelist origins (domains only)
	 * @type {Array<string>}
	 */
	const wlOrigins = JSON.parse(process.env.SECURITY_CORS_ALLOWED_ORIGINS || '[]')
		|| ['localhost', 'gameit.ai'];
	
	for ( const wlOrigin of wlOrigins ) {
		if ( wlOrigin.includes(hostname) ) {
			return true;
		}
	}
	
	return false;
};

/**
 * Fastify friendly CORS
 * @param {FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {Object} opts Plugin options
 * @param {function(): function} next Next function
 */
module.exports = fp(async ( fastify, opts, next ) => {
	fastify.use(require('cors')({
		optionsSuccessStatus: 204,
		preflightContinue: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		origin: ( origin, callback ) => {
			false !== getOrigin(fastify, origin)
				? callback(null, true)
				: callback(new Error('Not allowed by CORS'));
		}
	}));
	
	next();
}, {
	name: 'fastify-cors',
});
