const bcryptjs = require('bcryptjs');
const sha1 = require('sha1');
const moment = require('moment');
const {recursive} = require('merge');
const {nanoid} = require('nanoid');

/**
 * @public
 * @static
 * Return current Unix timestamp
 * @param {boolean} utc=true - Time in UTC or not
 * @returns {number} Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT).
 */
const time = ( utc = false ) => utc
  ? moment().utc().unix()
  : moment().unix();

/**
 * Method `generatePasswordHash` accepts the following options:
 * @typedef GeneratePasswordHashOptions
 * @property {number} cost - Which denotes the algorithmic cost that should be used. (Defaults to 10)
 */

/**
 * @private
 * @static
 * Generates a secure hash from a value and a random salt.
 * @param {string} value - Value to verify
 * @param {GeneratePasswordHashOptions} options={} - Additional options
 * @returns {string} - Generated hash string
 */
const generateHash = ( value, options = {} ) => {
  /** @type {GeneratePasswordHashOptions} */
  options = recursive(true, {
    cost: 11,
  }, options);
  
  /** @type {string} */
  const salt = bcryptjs.genSaltSync(options.cost);
  
  return bcryptjs.hashSync(value, salt);
};

/**
 * @public
 * @static
 * Generates a value's secure hash & password
 * @param {string} value - Value to hash
 * @returns {{password: string, hash: string}}
 */
function generatePassword ( value ) {
  return {
    password: sha1(value),
    hash: generateHash(value),
  }
}

/**
 * @public
 * @static
 * Generates authorization key
 * @returns {string}
 */
function generateAuthKey () {
  return nanoid(32);
}

module.exports = {
  time,
  generatePassword,
  generateAuthKey,
};
