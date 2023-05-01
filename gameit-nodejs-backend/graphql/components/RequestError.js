/**
 * GraphQL Custom error
 */

const {GraphQLError} = require('graphql');

/**
 * @class RequestError
 * @example
 * return new RequestError(
 *   'Invalid fields values given',
 *   'INVALID_VALUES',
 *   {'email': 'Invalid email address', ...}
 * );
 */
class RequestError extends GraphQLError {
	/**
	 * @public
	 * @static
	 * Create a custom GraphQL error with code and metadata
	 * @param {string} [message='The request is invalid.'] - Error message
	 * @param {?string} [code='BAD_REQUEST'] - Error code
	 * @param {?Object} [state={}] - {key:value} pairs of errors state
	 */
	constructor ( message = 'The request is invalid.', code = 'BAD_REQUEST', state = {} ) {
		super(message);
		
		// Request error code
		code && (this.code = code);
		
		// Additional state's meta data
		Object.keys(state).length && (this.state = state);
	}
}

module.exports = RequestError;
