
// Utils
const Mailer = require('./../../../utils/mailjet/mailer');

const CONTACT_TEMPLATE_ID = 3484793;

/**
 * Status index controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  app.post('/api/web/contact', async ( req, res ) => {
    await Mailer.sendEmail({
      name: 'GameIT Info',
      email: Mailer.EMAIL_GAMEIT_INFO,
    }, 'GameIT Contact Message Received', CONTACT_TEMPLATE_ID, {
      from: {
        name: 'GameIT Contact',
        email: Mailer.EMAIL_GAMEIT_NO_REPLY,
      },
      variables: req.body || {},
    });
    
    return res
      .status(200)
      .send({success: true, message: 'success'});
  });
};
