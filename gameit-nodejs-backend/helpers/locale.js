/**
 * Locale Utility functions
 * @module locale-helper
 */

const moment = require('moment-timezone');
const localeCode = require('locale-code');

/**
 * @public
 * Check that given local code is valid or not (xx-YY)
 * @param {string} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */
function validateLocale ( val ) {
	return localeCode.validate(val);
}

/**
 * @public
 * Check that given timezone is valid or not (xx-YY)
 * @param {string} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */
function validateTimezone ( val ) {
	let list = Array.from(moment.tz.names());
	return list.includes(val);
}

/**
 * Locale Utility functions
 * @example
 * const locHelper = require('./locale-helper');
 * console.log(await imgHelper.isValidTimeZone('UTC'));
 */
module.exports = {
	validateLocale,
	validateTimezone,
};
