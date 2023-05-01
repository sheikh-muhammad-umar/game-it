/**
 * User auth helper module
 */

const op = require('object-path');
const moment = require('moment');
const createError = require('http-errors');

// Utils
const RequestError = require('./../../../graphql/components/RequestError');

/**
 * @constructor
 * @param {FastifyInstance&FastifyServer} fastify fastify instance
 */
module.exports = ( fastify ) => {
	/** Auth user data loader */
	const Cookie = require('./cookie')(fastify);

	/**
	 * Clear auth cookies
	 * @param {FastifyRequest|FastifyRequest} request - Request instance
	 * @param {FastifyReply|FastifyResponse} reply - Response instance
	 * @param {boolean} force - Whatever remove cookie anyway
	 * @returns {Object} - Response data
	 */
	const clearAuthCookie = ( request, reply, force = true ) => {
		if ( force ) {
			Cookie.clearAuthCookie(request, reply);
			return;
		}

		// Clear/Delete auth cookie if the user is guest
		fastify.user.isGuest && Cookie.clearAuthCookie(request, reply);
	};

	/**
	 * Set auth cookie from response data
	 * @param {Object} data - Token response
	 * @param {FastifyRequest|FastifyRequest} request - Request instance
	 * @param {FastifyReply|FastifyResponse} reply - Response instance
	 * @throws {Error} - Failed to retrieve auth token
	 */
	const setAuthCookie = ( data, request, reply ) => {
		/** @type {?string} */
		const authToken = op.get(data, 'token', null);
		/** @type {?string} */
		const expiredAt = op.get(data, 'expiredAt', null);

		if ( !authToken || !expiredAt ) {
			throw new RequestError(request.t('Failed to retrieve auth token'), 'TOKEN_RETRIEVAL');
		}

		//Set auth cookie
		Cookie.setAuthCookie(reply, authToken, moment(expiredAt).valueOf());
	};

	/**
	 * @async
	 * Logout current user
	 * @param {FastifyRequest} request Request instance
	 * @param {FastifyResponse} reply Response instance
	 * @returns {Object} Response data
	 */
	const logout = async ( request, reply ) => {
		if ( fastify.user.isGuest ) {
			throw createError.Unauthorized();
		}

		const { /** @type {User} */ identity} = fastify.user;
		await identity.save();

		// Delete auth cookie
		Cookie.clearAuthCookie(request, reply);

		return {
			success: true,
		};
	};

	return {
		clearAuthCookie,
		logout,
		setAuthCookie,
	};
};
