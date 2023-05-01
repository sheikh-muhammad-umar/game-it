const passport = require('passport');
const R = require('ramda');

const {
  initializePassport,
} = require('../../../utils/express/passport/passport.config');

module.exports = ( {app, db} ) => {
  initializePassport({app, db});
  
  app.post('/api/user/info', passport.authenticate('jwt'), async ( req, res ) => {
    
    const onlyFields = [
      'email', 'firstName', 'lastName', 'username',
      'lastLoginAt', 'createdAt', 'updatedAt',
    ];
    
    const user = {
      ...R.pick(onlyFields, req.user.dataValues),
      flags: {},
    };
    
    // Force user to change initial password at first login
    !req.user.dataValues.active && (user.flags.passwordChangeRequired = true);
    
    return res.json({
      success: true, user,
    });
  });
};
