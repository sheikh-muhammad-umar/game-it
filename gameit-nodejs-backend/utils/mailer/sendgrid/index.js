const sgMail = require('@sendgrid/mail');
const op = require('object-path');
const {recursive} = require('merge');

// Utils
const Utils = require('./../utils');

/**
 * @private
 * @static
 * Render emails list
 * @param {Array<{name: string, email: string}>} list=[] - Send to email address
 * @return {Array<string>}
 */
function toEmailsList ( list = [] ) {
  return list.map(( {name, email} ) => `${name} <${email}>`);
}

/**
 * @namespace mailer
 * @name mailer~SendgridMailer
 * Sendgird mailer utility module
 * @see https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 */
function SendgridMailer ( fastify ) {
  sgMail.setApiKey(Utils.env.get('SENDGRID_API_KEY'));
  
  /**
   * @async
   * @public
   * Send a basic email
   * @function mailer~SendgridMailer.sendEmail
   * @param {Array<{name: string, email: string}>} to - Email address
   * @param {string} subject - Subject
   * @param {string} message - Message / contents
   * @param {Object} options - Additional options, see below
   * @param {import('@sendgrid/mail/src/mail').MailDataRequired} [options.sendgridOptions={}] - Additional sendgrid options
   * @param {{[string]: string}} [options.variables={}] - Placeholders list to replace from message
   * @return {Promise<Object>}
   */
  const sendEmail = async ( to, subject, message, options = {} ) => {
    if ( !to.length ) {
      throw new Error('You must provide at least one email recipient');
    }
    
    if ( !subject.trim().length ) {
      throw new Error('You must provide subject');
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
      sendgridOptions: {},
    }, options || {});
    
    /** @type {import('@sendgrid/mail/src/mail').MailDataRequired} */
    const sendgridOptions = recursive(true, {
      to: toEmailsList(to),
      subject,
      from: `${options.from.name} <${options.from.email}>`,
    }, options.sendgridOptions);
    
    //<editor-fold desc="Content options">
    options.textContent.trim() && (
      sendgridOptions.text = Utils.renderMessageVariables(options.textContent)
    );
    
    options.htmlContent.trim() && (
      sendgridOptions.html = Utils.renderMessageVariables(options.htmlContent)
    );
    //</editor-fold>
    
    try {
      return sgMail.send(sendgridOptions);
    } catch ( e ) {
      console.log('Sendgrid mailer error: ', e.message);
      throw e;
    }
  };
  
  /**
   * @async
   * @public
   * @function mailer~SendgridMailer.sendEmailTemplate
   * Send email using predefined template
   * @param {string} label - Template label to find in DB
   * @param {Array<{name: string, email: string}>} to - Email address
   * @param {Object} options - Additional options, see below
   * @param {{[string]: string}} [options.variables={}] - Placeholders list to replace from message
   * @param {import('@sendgrid/mail/src/mail').MailDataRequired} [options.sendgridOptions={}] - Additional sendgrid options
   * @param {string} [options.language='en-US'] - Translation language
   * @return {Promise<Object|undefined>}
   */
  const sendEmailTemplate = async ( label, to, options = {} ) => {
    /** @type {SendEmailOptions} */
    options = recursive(true, {
      language: 'en-US',
      variables: {},
      sendgridOptions: {},
    }, options || {});
    
    const {MailTemplate} = fastify.db.models;
    
    /** @type {?Object} */
    const template = await MailTemplate.findByLabel(label, {
      attributes: ['meta'],
      where: {
        isActive: true,
      },
      raw: true,
    });
    
    if ( !template ) {
      return void 0;
    }
    
    /**
     * @yields **_**
     * @type {string} */
    const language = options.language.replace('-', '_');
    
    /** @type {string} */
    const templateId = op.get(template, 'meta.templateId', '');
    
    /** @type {{subject: string, templateData: {rtl: boolean, text: string, header: ?string, buttonLink: ?string, buttonText: ?string}}} */
    const meta = op.get(template, `meta.languages.${language}`, op.get(template, `meta.languages.en_US`));
    
    /** @type {string} */
    const subject = Utils.renderMessageVariables(meta.subject, options.variables);
  
    /** @type {import('@sendgrid/mail/src/mail').MailDataRequired} */
    const sendgridOptions = recursive(true, {
      templateId,
      dynamicTemplateData: {
        subject,
        rtl: meta.templateData.rtl,
      },
    }, options.sendgridOptions);
    
    const renderVars = prop => Utils.renderMessageVariables(
      op.get(meta, `templateData.${prop}`, ''), options.variables
    );
  
    //<editor-fold desc="Set dynamicTemplateData variables">
    op.get(meta, 'templateData.text', '').trim() && (
      sendgridOptions.dynamicTemplateData.text = renderVars('text')
    );
    
    op.get(meta, 'templateData.header', '').trim() && (
      sendgridOptions.dynamicTemplateData.header = renderVars('header')
    );
    
    op.get(meta, 'templateData.buttonLink', '').trim() && (
      sendgridOptions.dynamicTemplateData.buttonLink = renderVars('buttonLink')
    );
    
    op.get(meta, 'templateData.buttonText', '').trim() && (
      sendgridOptions.dynamicTemplateData.buttonText = renderVars('buttonText')
    );
    //</editor-fold>
    
    return sendEmail(to, subject, 'Testing', {
      sendgridOptions,
      variables: options.variables,
    });
  };
  
  return {
    sendEmail,
    sendEmailTemplate,
  };
}

module.exports = SendgridMailer;