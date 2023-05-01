const {recursive} = require('merge');
const op = require('object-path');

module.exports = (fastify) => {
  const {MailTemplate} = fastify.db.models;
  const Mailer = {};
  const Mail = require('./mailer');
  const findTemplateByLabel = async (label, language) => {

  const mailTemplate = await MailTemplate.findOne({
    where: {
      label,
    }
  });

    if (!mailTemplate.get('isActive')) { return null; }

    const template = mailTemplate.getJsonValue(`languages.${language}`, mailTemplate.getJsonValue('languages.en_US'));

    return template;
  }

  Mailer.sendEmailTemplate = async (label, to, options) => {
     /** @type {SendEmailOptions} */
      options = recursive(true, {
          language: 'en-US'
      }, options || {});

      const lang = options.language.replace('-', '_');

      const {subject, templateId} = await findTemplateByLabel(label, lang);

      return Mail.sendEmail(to, subject, templateId, options);
  };

  return Mailer;
};