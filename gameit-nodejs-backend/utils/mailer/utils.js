const op = require('object-path');

/**
 * @typedef MailerInterface
 * @property {function(Array<{name: string, email: string}>, string, string, Object=): Promise<Object>} sendEmail - Send a basic email
 * @property {function(string, Array<{name: string, email: string}>, Object=): Promise<Object>} sendEmailTemplate - Send email using template (localization)
 */

/**
 * Environment variables accessor
 * @type {import('object-path').ObjectPathBound<Object>} */
const env = op(process.env);

/**
 * Tech email address
 * @type {string} */
const EMAIL_GAMEIT_TECH = env.get('EMAIL_GAMEIT_TECH', 'tech@gameit.ai');

/**
 * Info email address
 * @type {string} */
const EMAIL_GAMEIT_INFO = env.get('EMAIL_GAMEIT_INFO', 'info@gameit.ai');

/**
 * NoReply email address
 * @type {string} */
const EMAIL_GAMEIT_NO_REPLY = env.get('EMAIL_GAMEIT_NO_REPLY', 'noreply@gameit.ai');

/**
 * @private
 * @static
 * Get predefined variables list
 * @return {{[string]: string}}
 */
const getPredefinedVariables = () => ({
  organizationName: 'GameIT Square',
  webUrl: `${env.get('WEBSITE_BASE_URL', '').replace(/\/$/, '')}`,
  webPortalUrl: `${env.get('WEBSITE_PORTAL_URL', '').replace(/\/$/, '')}`,
});

/**
 * @public
 * @static
 * Render message dynamic variable
 * @param {string} message - Message to replace
 * @param {{[string]: string|number}} variables - List of variables to replace from message (e.g., {name: 'Zeeshan Ahmed'}
 * @return {string}
 */
function renderMessageVariables ( message, variables ) {
  const combinedVariables = {
    ...getPredefinedVariables(),
    ...variables,
  };
  
  if ( !Object.keys(combinedVariables).length ) {
    return message;
  }
  
  /** @type {string} */
  let text = message;
  
  for ( const [key, value] of Object.entries(combinedVariables) ) {
    text = text.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  
  return text;
}

module.exports = {
  EMAIL_GAMEIT_NO_REPLY,
  EMAIL_GAMEIT_INFO,
  EMAIL_GAMEIT_TECH,
  env,
  renderMessageVariables,
};