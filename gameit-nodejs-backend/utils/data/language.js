/**
 * @public
 * @static
 * Check that Language exists
 * @param {string} language - Language to check
 * @returns {boolean}
 */
 function languageExists ( language ) {
    return ["en-US","ar-SA"].includes(language);
  }
  
  module.exports = {
    languageExists
  };
  