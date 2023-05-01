/** @namespace Mailjet */

const Mailjet = require('node-mailjet');
const {recursive} = require('merge');
const op = require('object-path');

/**
 * Environment variables accessor
 * @type {objectPath.ObjectPathBound} */
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

/** Mailjet client instance */
const mailerInstance = Mailjet.connect(
  env.get('MAILJET_API_KEY'),
  env.get('MAILJET_SECRET_KEY')
);

/**
 * @typedef SendEmailOptions
 * @type {Object}
 * @property {Object} [variables={}] - Mailjet template variables
 * @property {Object} [from] - `From` options
 * @property {string|null} [from.name] - `From` name
 * @property {string|null} [from.email] - `From` email address
 */

/**
 * @public
 * @static
 * Send email using MailJet service
 * @param {{name: string, email: string}} to - Email address with name
 * @param {string} subject - Email subject
 * @param {number} templateId - Mailjet template ID
 * @param {SendEmailOptions} options={} - Additional options
 * @memberOf Mailjet
 * @returns {Promise<any>}
 */
async function sendEmail ( to, subject, templateId, options = {} ) {
  /** @type {{name: string, email: string}} */
  to = {
    name: '', email: '', ...to
  };
  
  /** @type {SendEmailOptions} */
  options = recursive(true, {
    variables: {},
    from: {
      name: 'Gameit No-reply',
      email: EMAIL_GAMEIT_NO_REPLY,
    },
  }, options || {});
  
  try {
    return mailerInstance.post('send', {version: 'v3.1'}).request({
      Messages: [
        {
          From: {
            Name: options.from.name,
            Email: options.from.email,
          },
          To: [
            {
              Name: to.name,
              Email: to.email,
            },
          ],
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: subject,
          Variables: options.variables,
        },
      ],
    });
  } catch ( e ) {
    console.log('Mailjet mailer error: ', e.message);
  }
}

module.exports = {
  sendEmail,
  EMAIL_GAMEIT_TECH,
  EMAIL_GAMEIT_INFO,
  EMAIL_GAMEIT_NO_REPLY,
};
