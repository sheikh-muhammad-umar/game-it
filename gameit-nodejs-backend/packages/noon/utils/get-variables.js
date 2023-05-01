import op from 'object-path';

/**
 * @typedef {Object} NoonPaymentConfiguration
 * @property {string} endpoint -
 * @property {'Test'|'Live'} mode - Change the mode to Live for the Production
 * @property {'Web'|'Mobile'} channel - Channels are pre-defined and limited to Web and Mobile.
 * @property {'Pay'} category - Value of pre-configured order route categories. These categories are customizable.
 * @property {'AED'|'USD'|'SAR'|string} currency - Currency of the order (e.g. AED, USD, SAR, ...)
 * @property {string} returnUrl - Merchant's response back URL, auto redirect after successful 3DS process
 * @property {string} authKey - Authorization header value to pass
 */

/**
 * @public
 * @static
 * @function
 * Get noon payment configuration variables
 * @return {Object<NoonPaymentConfiguration>}
 */
const getVariables = () => {
  /** @type {import('object-path').ObjectPathBound} */
  const env = op(process.env);
  const result = {};
  
  result.endpoint = env.get('NOON_PAYMENT_ENDPOINT', 'https://api-test.noonpayments.com/payment/v1')
    .replace(/\/+$/g, '');
  
  result.mode = env.get('NOON_PAYMENT_MODE', 'Test');
  result.channel = env.get('NOON_PAYMENT_CHANNEL', 'Web');
  result.category = env.get('NOON_PAYMENT_CATEGORY', 'Pay');
  result.currency = env.get('NOON_PAYMENT_CURRENCY', 'SAR');
  result.returnUrl = env.get('NOON_PAYMENT_RETURN_URL', '')
    .replace(/\/+$/g, '');
  
  /** @type {string} */
  const keyFormat = env.get(
    'NOON_PAYMENT_KEY_FORMAT', 'Key_{mode} {authKey}',
  );
  
  /** @type {string} */
  const authKey = env.get(
    'NOON_PAYMENT_AUTH_KEY', 'Z2FtZWl0LkdhbWVpdFNhbmRib3g6MDEwOGIxYWI2M2Q5NGIyYmI3OTM2YmYyOTU2OGI2NDM=',
  );
  
  result.authKey = keyFormat
    .replace('{mode}', result.mode)
    .replace('{authKey}', authKey);
  
  return result;
};

/**
 * @return {()=>Object<NoonPaymentConfiguration>}
 */
module.exports = getVariables;