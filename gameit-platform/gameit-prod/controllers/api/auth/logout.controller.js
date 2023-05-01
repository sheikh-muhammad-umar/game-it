const passport = require('passport');
const {
  initializePassport,
} = require('../../../utils/express/passport/passport.config');

/**
 * Logout controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  initializePassport({app, db});
  const {Admin, sequelize} = db;
  
  app.get('/api/auth/logout', passport.authenticate('jwt'), async ( req, res ) => {
    /** @type {import('sequelize').Model&Admin#} */
    const model = req.user;
  
    model.generateAuthKey();
    
    await model.save();
    
    return res.json({
      success: true,
    });
  });
};
