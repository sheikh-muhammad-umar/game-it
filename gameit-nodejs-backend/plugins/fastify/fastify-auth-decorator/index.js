/**
 * Auth Request (optional) Fastify Plugin
 * @description Automatically sign in user if token is detected in request
 */

const fp = require('fastify-plugin');

// Modules
const JWTIdentity = require('./../../../helpers/fastify/auth/jwt-identity');

/**
 * Fastify mailer plugin
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @param {Object} opts - Plugin options
 * @param {function():function} next - Next function
 * @returns {Promise<any>} - Promise instance
 */
async function main ( fastify, opts, next ) {
	const {findIdentityByToken, getTokenFromAll} = JWTIdentity(fastify);

	/**
	 * User identifier
	 * @class FastifyIdentity
	 */
	fastify.decorate('user', {
		/**
		 * @name FastifyIdentity#isGuest
		 * @member FastifyIdentity
		 * Guest user or not
		 * @type {boolean}
		 */
		isGuest: true,
		/**
		 * @name FastifyIdentity#identity
		 * @member FastifyIdentity
		 * User model
		 * @type {?User}
		 */
		identity: null,
		/**
		 * @name FastifyIdentity#id
		 * @member FastifyIdentity
		 * @property
		 * Current user ID
		 * @type {?number}
		 */
		id: null,
	});
	
	fastify.addHook('onRequest', async ( req ) => {
		if ( req.url === '/graphql' ) {
			fastify.log.info('Skip auth check for graphql request')
			return undefined;
		}
		
		const jwtToken = String(getTokenFromAll(req) || '').trim();
		
		if ( !jwtToken ) {
			fastify.log.error('No authorisation token provided (COOKIES, GET, POST, BODY)');
			return;
		}
		
		fastify.log.info(`Provided authorisation token: ${jwtToken}`);
		
		const {model = null} = await findIdentityByToken(jwtToken, {req});
		fastify.user.isGuest = model === null;
		fastify.user.id = fastify.user.isGuest ? null : model.id;
		fastify.user.identity = model;
	});
	
	next();
}

module.exports = fp(main, {
	name: 'fastify-auth-decorator',
});
