/**
 * JWT Auth for specific routes
 */

'use strict';

/** Native/Installed modules */
const fp = require('fastify-plugin');

/**
 * Register a main function
 * @param {FastifyServer} fastify fastify instance
 * @param {{string: any}} opts Plugin options
 * @param {function(): function} next Next function
 */
async function main ( fastify, opts, next ) {
	// Warning: sequence matters, unless you are some troublemaker.
	/**
	 * JWT Token
	 * @mixes jwt
	 * @class FastifyJwt
	 */
	fastify.register(require('fastify-jwt'), {
		secret: process.env.JWT_SECRET,
	});

	/**
	 * @typedef {{string: string}} FastifyJwt~TokenData
	 * @see {@link Moment#format} Moment.js
	 * Atom date format: YYYY-MM-DDTHH:mm:ssZ
	 * @property {string} token JWT auth token
	 * @property {string} issuedAt Issued at (ATOM date)
	 * @property {string} expiredAt Expiration time (ATOM date)
	 */

	/**
	 * @typedef {object} FastifyJwt~JwtDecoded
	 * @see {@link FastifyJwt#decode} FastifyJwt.decode
	 * @property {string} iss Issuer (who created and signed this token)
	 * @property {string} aud Audience (who or what the token is intended for)
	 * @property {string} jti JWT ID (unique identifier for this token)
	 * @property {string} sub Subject (whom the token refers to)
	 * @property {number} iat Issued at (seconds since Unix epoch)
	 * @property {number} nbf Not valid before (seconds since Unix epoch)
	 * @property {number} exp Expiration time (seconds since Unix epoch)
	 * @property {string} idt Identity auth key
	 * @property {number} rol User Role (Created for Owner/Agent/Developer)
	 */

	/**
	 * @name FastifyJwt#sign
	 * @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
	 * @function
	 * @memberof FastifyJwt
	 * @description Sign and create JSON Web token
	 * Signature algorithm. Could be one of these values:
	 * - HS256:    HMAC using SHA-256 hash algorithm (default)
	 * - HS384:    HMAC using SHA-384 hash algorithm
	 * - HS512:    HMAC using SHA-512 hash algorithm
	 * - RS256:    RSASSA using SHA-256 hash algorithm
	 * - RS384:    RSASSA using SHA-384 hash algorithm
	 * - RS512:    RSASSA using SHA-512 hash algorithm
	 * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
	 * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
	 * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
	 * - none:     No digital signature or MAC value included<br>
	 * @param {(string|Buffer|object)} payload - Could be an object literal, buffer or string representing valid JSON.
	 * @param {object} options - Sign Options
	 * @param {?string[]} options.algorithms List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
	 * @param {?(string|number)} options.expiresIn - expressed in seconds or a string describing a time span zeit/ms
	 * @param {?(string|number)} options.notBefore - expressed in seconds or a string describing a time span zeit/ms.
	 * @param {?string} options.audience - if you want to check audience (aud), provide a value here. The audience can be checked
	 * against a string, a regular expression or a list of strings and/or regular expressions.
	 * @param {?string} options.subject - if you want to check subject (sub), provide a value here
	 * @param {?string} options.issuer - iss field.
	 * @param {?string} options.jwtid - ...
	 * @param {?boolean} options.noTimestamp - ...
	 * @param {?object} options.header - ...
	 * @param {?string} options.encoding - ...
	 * @param {?boolean} options.mutatePayload -  if true, the sign function will modify the payload object directly. This is useful if you
	 * need a raw reference to the payload after claims have been applied to it but before it has been encoded into a token.
	 * @param {function(err<Error>, token<string>): void} callback - The callback
	 */

	/**
	 * @name FastifyJwt#verify
	 * @function
	 * @memberof FastifyJwt
	 * @desc Verify given token using a secret or a public key to get a decoded token
	 * Signature algorithm. Could be one of these values :
	 * - HS256:    HMAC using SHA-256 hash algorithm (default)
	 * - HS384:    HMAC using SHA-384 hash algorithm
	 * - HS512:    HMAC using SHA-512 hash algorithm
	 * - RS256:    RSASSA using SHA-256 hash algorithm
	 * - RS384:    RSASSA using SHA-384 hash algorithm
	 * - RS512:    RSASSA using SHA-512 hash algorithm
	 * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
	 * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
	 * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
	 * - none:     No digital signature or MAC value included<br>
	 * @param {string} token the JsonWebToken string
	 * @param {object} options - Verify Options
	 * @param {?string[]} options.algorithms List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
	 * @param {?string|string[]} options.audience - if you want to check audience (aud), provide a value here. The audience can be checked
	 * against a string, a regular expression or a list of strings and/or regular expressions.
	 * @param {?string|string[]} options.issuer - string or array of strings of valid values for the iss field.
	 * @param {?boolean} options.ignoreExpiration - if `true` do not validate the expiration of the token.
	 * @param {?boolean} options.ignoreNotBefore - ...
	 * @param {?string} options.subject - if you want to check subject (sub), provide a value here
	 * @param {?number} options.clockTolerance - number of seconds to tolerate when checking the `nbf` and `exp` claims, to deal with small
	 * clock differences among different servers
	 * @param {?string} options.maxAge - the maximum allowed age for tokens to still be valid. It is expressed in seconds
	 * or a string describing a time span
	 * @param {?number} options.clockTimestamp - the time in seconds that should be used as the current time for all necessary comparisons.
	 * @param {?string} options.nonce - if you want to check `nonce` claim, provide a string value here.
	 * It is used on Open ID for the ID Tokens.
	 * @param {function(err<Error>, decoded<JwtDecoded>): void} callback - Returns the payload decoded if the signature is valid and optional
	 * expiration, audience, or issuer are valid. If not, it will throw the error.
	 */

	/**
	 * @name FastifyJwt#decode
	 * @function
	 * @memberof FastifyJwt
	 * @description Returns the decoded payload without verifying if the signature is valid.
	 * @param {string} token the JsonWebToken string
	 * @param {object.<string, boolean>} options - The number of times to print.
	 * @param {boolean} options.json force JSON.parse on the payload even if the header doesn't contain "typ":"JWT"
	 * @param {boolean} options.complete return an object with the decoded payload and header.
	 * @returns {JwtDecoded} Decoded payload
	 */

	next();
}

// Export plugin to module
module.exports = fp(main, {
	name: 'fastify-jwt'
});
