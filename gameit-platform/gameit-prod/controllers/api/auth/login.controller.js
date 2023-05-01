const R = require('ramda');
const jwt = require('../../../utils/jwt/manage-tokens');

/**
 * Login controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  // console.log(db);
  const {Admin} = db;
  
  app.post('/api/auth/login', async ( req, res ) => {
    const {username = '', password = ''} = req.body;
    
    /** @type {import('sequelize').Model&Admin#} */
    const model = await Admin.findByEmailOrUsername(username);
    
    if ( model === null ) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if ( !model.validatePassword(password) ) {
      return res.status(400).json({
        success: false,
        message: 'Password mismatched',
      });
    }
  
    const onlyFields = [
      'email', 'firstName', 'lastName', 'username',
      'lastLoginAt', 'createdAt', 'updatedAt',
    ];
    
    const user = {
      ...R.pick(onlyFields, model.toJSON()),
      flags: {},
    };
    
    // Force user to change initial password at first login
    !model.active && (user.flags.passwordChangeRequired = true);
    
    // const oneDayToSeconds = 24 * 60 * 60;
    //     res.cookie('auth-token', token, {
    //         maxAge: oneDayToSeconds,
    //         useCredentials: true,
    //     });

    return res.status(200).json({
      success: true,
      user,
      token: jwt.createToken({
        token: model.getAuthKey(),
        // Additional JWT metadata here
      })
    });
});
}
