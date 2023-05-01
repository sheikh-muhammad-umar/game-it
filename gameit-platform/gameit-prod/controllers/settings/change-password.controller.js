const passport = require('passport');

// Utils
const {initializePassport} = require('../../utils/express/passport/passport.config');
const Mailjet = require('../../utils/mailjet/mailer');


/**
 * Change password controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  initializePassport({app, db});
  const {Admin, sequelize} = db;
  
  app.post(
    '/api/settings/change-password',
    passport.authenticate('jwt'),
    async ( req, res ) => {
      /** @type {import('sequelize').Transaction} */
      const transaction = await sequelize.transaction();
      
      const {password = '', newPassword = ''} = req.body;
  
      /** @type {import('sequelize').Model&Admin#} */
      const model = req.user;
      
      if ( !model.validatePassword(password) ) {
        return res.status(400).json({
          success: false,
          message: 'Current password invalid.',
        });
      }
      
      model.setPassword(newPassword);
      model.active = true;
  
      try {
        // Save changes
        await model.save({transaction});
    
        // Send email notification
        await Mailjet.sendEmail({
          name: `${model.firstName} ${model.lastName}`,
          email: model.email,
        }, 'Password Changed For Gameit Account', 3866391, {
          from: {
            name: 'Change Password',
          },
          variables: {
            firstname: model.firstName,
          }
        });
    
        await transaction.commit();
      } catch ( e ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          code: 'PROCESS_FAILED',
          message: 'Failed to update account password',
        });
      }
  
      return res.json({
        success: true,
        message: 'Password successfully changed.',
      });
    }
  );
};
