const jwt = require('jsonwebtoken');
const op = require('object-path');

/** @type {objectPath~ObjectPathBound} */
const env = op(process.env|| {});

/** @type {string} */
const JWT_SECRET = env.get('JWT_SECRET', '');

/**
 * @public
 * @static
 * Create a JWT token
 * @param {Object} payload - Payload data
 * @param {import('jsonwebtoken').SignOptions} options - JWT options
 * @returns {string}
 */
function createToken ( payload, options = {} ) {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS512',
    issuer: 'gameit.ai',
    expiresIn: '7 days',
    ...options,
  });
}

module.exports = {
  createToken,
};
