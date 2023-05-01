const path = require('path');

/**
 * @public
 * @static
 * Normalize path, Fix path slashes issue (OS related)
 * @param {string} str - The path
 * @returns {string}
 */
function normalize(str) {
  return path.resolve(str)
    .replace(/\\/g, '/');
}

module.exports = {
  normalize,
};
