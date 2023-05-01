const {recursive} = require('merge');
const Mailjet = require('node-mailjet');

// Utils
const Utils = require('./../utils');

/**
 * Mailjet API version
 * @type {string} */
const MAILJET_API_VERSION = '3.1';

/**
 * @namespace mailer
 * @name mailer~MailjetMailer
 * Mailjet mailer utility module
 * @see https://dev.mailjet.com/email/guides/send-api-v31/
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 */
function MailjetMailer ( fastify ) {
  /**
   * @private
   * @static
   * Render emails list
   * @param {Array<{name: string, email: string}>} list=[] - Send to email address
   * @return {Array<{Name: string, Email: string}>}
   */
  function toEmailsList ( list = [] ) {
    return list.map(( {name, email} ) => ({
      Name: name,
      Email: email,
    }));
  }
  
  /** Mailjet client instance */
  const mailerInstance = Mailjet.connect(
    Utils.env.get('MAILJET_API_KEY'),
    Utils.env.get('MAILJET_SECRET_KEY'),
  );
  
  /**
   * The `mailjet.sendEmail` additional options
   * @typedef MailjetSendEmailOptions
   * @property {{[string]: any}} variables - Dynamic variables
   * @property {string} [textContent] - Text message part
   * @property {string} htmlContent - HTML message part <i>defaults to subject</i>
   * @property {{name: string, email: string}} [from] - From name & email address
   * @property {?number} [templateId=null] - Template ID (optional)
   */
  
  /**
   * @async
   * @public
   * Send a basic email
   * @function mailer~MailjetMailer.sendEmail
   * @param {Array<{name: string, email: string}>} to - Email address
   * @param {string} subject - Subject
   * @param {string} [message] - Message / contents (HTML)
   * @param {MailjetSendEmailOptions} options - Additional options, see below
   * @return {Promise<Object>}
   */
  const sendEmail = async ( to, subject, message, options = {} ) => {
    if ( !to.length ) {
      throw new Error('You must provide at least one email address.');
    }
    
    if ( !subject.trim().length ) {
      throw new Error('You must provide email subject.');
    }
    
    /** @type {SendEmailOptions} */
    options = recursive(true, {
      variables: {},
      textContent: '',
      htmlContent: message,
      from: {
        name: 'Gameit',
        email: Utils.EMAIL_GAMEIT_NO_REPLY,
      },
      templateId: null,
    }, options || {});
    
    /** @type {import('node-mailjet').Email.SendParams} */
    const mailjetOptions = {
      Messages: [
        {
          From: {
            Name: options.from.name,
            Email: options.from.email,
          },
          To: toEmailsList(to),
          Subject: subject,
          Variables: options.variables,
        },
      ],
    };
    
    //<editor-fold desc="Content options">
    options.textContent.trim() && (
      mailjetOptions.Messages[0].TextPart = options.textContent
    );
  
    options.htmlContent.trim() && (
      mailjetOptions.Messages[0].HTMLPart = options.htmlContent
    );
    //</editor-fold>
    
    //<editor-fold desc="Template options">
    if ( options.templateId ) {
      mailjetOptions.Messages[0].TemplateID = options.templateId;
      mailjetOptions.Messages[0].TemplateLanguage = true;
    }
    //</editor-fold>
  
    try {
      return mailerInstance.post('send', {
        version: MAILJET_API_VERSION,
      }).request(mailjetOptions);
    } catch ( e ) {
      console.log('Mailjet mailer error: ', e.message);
      throw e;
    }
  };
  
  /**
   * @async
   * @public
   * Send a basic email
   * @function mailer~MailjetMailer.sendEmailTemplate
   * @param {string} label - Template label to find in DB
   * @param {Array<{name: string, email: string}>} to - Email address
   * @param {Object} options - Additional options, see below
   * @return {Promise<Object>}
   */
  const sendEmailTemplate = async ( label, to, options = {} ) => {
  };
  
  return {
    sendEmail,
    sendEmailTemplate,
  };
}

module.exports = MailjetMailer;