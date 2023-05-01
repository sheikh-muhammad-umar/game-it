const {customAlphabet} = require('nanoid');

/**
 * @public
 * @static
 * Generate a verification code
 * @returns {string}
 */
const verificationCode = ( limit = 6 ) => {
  return customAlphabet('0123456789', limit)(limit);
};

module.exports = {
  verificationCode,
};
