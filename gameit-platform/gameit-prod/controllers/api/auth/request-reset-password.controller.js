const op = require('object-path');

// Utils
const Mailjet = require('../../../utils/mailjet/mailer');

const env = op(process.env);

/**
 * Reset password request controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  const {Admin, sequelize} = db;
  
  app.post(
    '/api/auth/request-reset-password', async ( req, res ) => {
      /** @type {import('sequelize').Transaction} */
      const transaction = await sequelize.transaction();
      
      const {username = ''} = req.body;
      
      if ( !String(username || '').trim() ) {
        return res.status(400).json({
          success: false,
          code: 'MISSING_USERNAME',
          message: 'Missing required username',
        });
      }
      
      /** @type {import('sequelize').Model&Admin#} */
      const model = await Admin.findByEmailOrUsername(username);

      if ( model === null ) {
        return res.status(404).json({
          success: false,
          code: 'NOT_FOUND',
          message: 'Username or email address does not exist',
        });
      }
  
      // Generate token
      model.generatePasswordResetToken();
      
      const resetPasswordUrl =
        `${env.get('WEBSITE_BASE_URL', '')}/admin/reset-password?token=${model.passwordResetToken}`
      
      try {
        // Save changes
      	await model.save({transaction});
        
        // Send email notification
        await Mailjet.sendEmail({
          name: `${model.firstName} ${model.lastName}`,
          email: model.email,
        }, 'Reset your Gameit account password', 3860645, {
          from: {
            name: 'Reset Password',
          },
          variables: {
            resetpassword_link: resetPasswordUrl,
          }
        });
        
        await transaction.commit();
      } catch ( e ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          code: 'PROCESS_FAILED',
          message: 'Failed to send reset password request',
        });
      }
    
      return res.json({
        success: true,
        message: 'Notification sent',
      });
    }
  );
};
