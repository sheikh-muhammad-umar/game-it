const Mailjet = require('../../../utils/mailjet/mailer');

/**
 * Reset password controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  const {Admin, sequelize} = db;
  
  app.post(
    '/api/auth/reset-password', async ( req, res ) => {
      /** @type {import('sequelize').Transaction} */
      const transaction = await sequelize.transaction();
      
      /**
       * @property {string} token - Reset password token
       * @property {string} password - New password
       */
      const {token = '', password = ''} = req.body;
    
      /** @type {import('sequelize').Model&Admin#} */
      const model = await Admin.findByPasswordResetToken(token);

      if ( model === null ) {
        return res.status(404).json({
          success: false,
          code: 'NOT_FOUND',
          message: 'Either token is invalid or expired',
        });
      }
      
      model.setPassword(password);
      model.removePasswordResetToken();
      model.generateAuthKey();
    
      try {
        // Save changes
        await model.save({transaction});
      
        // Send email notification
        await Mailjet.sendEmail({
          name: `${model.firstName} ${model.lastName}`,
          email: model.email,
        }, 'Password Changed For Gameit Account', 3866391, {
          from: {
            name: 'Gameit Password Changed',
          },
          variables: {
            firstname: model.firstName,
          }
        });
      
        await transaction.commit();
      } catch ( e ) {
        console.log('Error:', e);
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          code: 'PROCESS_FAILED',
          message: 'Failed to update account password',
        });
      }
    
      return res.json({
        success: true,
      });
    }
  );
};
