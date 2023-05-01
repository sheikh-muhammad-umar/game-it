/**
 * Fastify GraphQL Plugin
 */

const fp = require('fastify-plugin');
const op = require('object-path');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const {execute, subscribe} = require('graphql');

// Utils
const schemaCompiler = require('./../lib/schema-compiler');
const JWTIdentity = require('./../../../../helpers/fastify/auth/jwt-identity');
const isDev = process.env.NODE_ENV !== 'production';

/**
 * @private
 * @static
 * Get auth token from connection params
 * @param {{string: string}} params - Connection params
 * @return {?string} - The token / Nothing
 */
const getTokenFromParams = ( params ) => {
	for ( let [k, v] of Object.entries(params) ) {
		if ( /auth_?token/i.test(k) ) {
			return v;
		}
		
		if ( k.toLowerCase() === 'authorization' ) {
			const [, token = ''] = String(v||'')
				.match(/^Bearear (.+)$/);
			return String(token||'').trim();
		}
	}
	
	return null;
};

/**
 * @public
 * Plugin handler
 * @param {FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {Object} opts - Additional options
 * @param {function(): void} next - Function to continue fastify lifecycle
 * @returns {Promise<void>}
 */
module.exports = fp(async ( fastify, opts, next ) => {
	// import required methods
	const {findIdentityByToken, getTokenFromAll} = JWTIdentity(fastify);
	
	/**
	 * Compiled schema
	 * @type {Object} */
	const schema = schemaCompiler(fastify, opts);
	
	/**
	 * @private
	 * @async
	 * Get user identity by auth token from request
	 * @param {Object} connectParams - Connection parameters
	 * @param {Query~GraphQLContext} ctx - Fastify reply instance
	 * @return {Promise<void>} - Promise instance
	 * @throws {Error} - No token found
	 */
	const retrieveIdentity = async ( connectParams, {request} ) => {
		/** @type {?string} */
		let token = getTokenFromParams(connectParams);
		
		if ( !token ) {
			token = getTokenFromAll(request);
		}
		
		if ( token instanceof Error ) {
			throw new Error(token.message);
		}
		
		const {model} = await findIdentityByToken(token, {req: request});
		fastify.user.identity = model;
		fastify.user.isGuest = false;
	};
	
	SubscriptionServer.create({
		schema,
		execute,
		subscribe,
		onOperation ( msg, params ) {
			params.context = {app: fastify};
			params.formatError = error => {
				const exception = op.get(error, 'extensions.exception');
				delete error.extensions.exception;
				return {...error, ...exception};
			};
			return params;
		},
		async onConnect ( connectionParams, webSocket, ctx ) {
			isDev && console.log(`------ Graphql socket connected ------`);
			await retrieveIdentity(connectionParams, ctx);
		},
		async onDisconnect () {
			isDev && console.log(`------ Graphql socket disconnected ------`);
		},
	}, {
		server: fastify.server,
		path: '/graphql',
	});
	
	next();
}, {
	name: 'fastify-apollo-subscription',
});

