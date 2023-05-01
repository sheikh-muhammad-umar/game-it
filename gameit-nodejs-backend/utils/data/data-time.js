const moment = require('moment-timezone');

/**
 * @private
 * @type {Array<string>}
 */
let timezoneListDictionary = [];

/**
 * @public
 * @static
 * Get timezone list
 * @returns {Array<string>}
 */
function timezoneList () {
  return timezoneListDictionary.length
    ? timezoneListDictionary
    : (timezoneListDictionary = moment.tz.names());
}

/**
 * @public
 * @static
 * Check that timezone exists
 * @param {string} timezone - Timezone to check
 * @returns {boolean}
 */
function timezoneExists ( timezone ) {
  return timezoneList().includes(timezone);
}

/**
 * @public
 * @static
 * Get a current timestamp
 * @param {string} format="YYYY-MM-DD HH:mm:ss" - Format
 * @param {string} [timezone="UTC"] - Timezone
 * @returns {string}
 */
function timestamp ( format = 'YYYY-MM-DD HH:mm:ss', timezone = 'UTC' ) {
  return moment().format(format);
}

module.exports = {
  timezoneList,
  timezoneExists,
  timestamp,
};
