
/**
 * Reset password controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  const {Admin} = db;
  
  app.post(
    '/api/auth/validate-reset-password-token', async ( req, res ) => {
      /**
       * @property {string} token - Password reset token
       */
      const {token = ''} = req.body;
    
      if ( !String(token || '').trim() ) {
        return res.status(400).json({
          success: false,
          code: 'MISSING_TOKEN',
          message: 'Missing reset password token',
        });
      }
      
      /** @type {boolean} */
      const exists = !!await Admin.count({
        where: {
          passwordResetToken: token
        }
      });
      
      if ( !exists ) {
        return res.status(404).json({
          success: false,
          code: 'NOT_FOUND',
          message: 'Token does not exist',
        });
      }
      
      return res.json({
        success: true,
      });
    }
  );
};
