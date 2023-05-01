// Utils
const SendgridMailer = require('./sendgrid');
const MailjetMailer = require('./mailjet');

/**
 * @namespace mailer
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 */
function Mailer ( fastify ) {
  return Object.freeze({
    /**
     * @readonly
     * Mailjet mailer instance
     * @type {mailer~MailjetMailer}
     */
    mailjet: MailjetMailer(fastify),
    /**
     * @readonly
     * Sendgrid mailer instance
     * @type {mailer~SendgridMailer}
     */
    sendgird: SendgridMailer(fastify),
    /**
     * @readonly
     * @public
     * Get mailer instance
     * @instance
     * @return {mailer~SendgridMailer}
     */
    getInstance () {
      return this.sendgird;
    },
  });
}

module.exports = fastify => Mailer(fastify);