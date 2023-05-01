/**
 * Crypto Utility functions
 */

const crypto = require('crypto');

/**
 * Available hashes
 * @type {Array<string>} */
const hashes = crypto.getHashes();

/**
 * Supported hash algorithms
 * @typedef {'md5'|'sha1'|'sha256'|'sha384'|'sha512'} Algorithm
 */

/**
 * @public
 * @static
 * @namespace CryptoHelper
 * Create a hash of given value
 * @param {string|Buffer|TypedArray|DataView} value - The value
 * @param {Algorithm} algorithm='sha256' - The value
 * @returns {string} - Created Hash
 * @throws {Error} - Unsupported hash algorithm
 */
function createHash ( value, algorithm = 'sha256' ) {
	if ( !hashes.includes(algorithm) ) {
		throw new Error ('Unsupported hash algorithm');
	}
	
	return crypto
		.createHash(algorithm)
		.update(value)
		.digest('hex');
}

/**
 * @public
 * @static
 * @namespace CryptoHelper
 * Create a hash of given value
 * @param {string|Object} value - A JSON string / An Object
 * @param {Algorithm} algorithm='sha256' - The value
 * @returns {string} - The Hash;
 */
function createHashJson ( value, algorithm = 'sha256' ) {
	/** @type {string} */
	let json = typeof value === 'string'
		? value
		: JSON.stringify(value);
	
	return createHash(json, algorithm);
}

/**
 * @public
 * @static
 * @namespace CryptoHelper
 * Create a UUID
 */
 function createUUID () {
	/** @type {string} */
	let uuid = typeof value === 'string'
		? value
		: crypto.randomUUID();
	
	return uuid;
}


module.exports = {
	createHash,
	createHashJson,
	createUUID
};
