const {countries} = require('countries-list');

/**
 * @public
 * @static
 * Check that country code is valid or not
 * @param {string} code - Show native name
 * @returns {boolean}
 */
function isValidCode ( code ) {
  return countries.hasOwnProperty(code);
}

/**
 * @public
 * @static
 * Get country list
 * @param {boolean} [native=false] - Show native name
 * @returns {Array<Object>}
 */
function getList ( native ) {
  /** @type {Array<Object>} */
  const nodes = [];
  
  for ( const [code, data] of Object.entries(countries) ) {
    nodes.push({
      code,
      name: native ? data.native : data.name,
    });
  }
  
  return nodes;
}

module.exports = {
  getList,
  isValidCode,
};
