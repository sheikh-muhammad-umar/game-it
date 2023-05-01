
/**
 * Index test controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  const {User} = db;
  
  app.get('/api/test/index', async ( req, res ) => {
    const users = await User.findAll({
      limit: 1,
    });
    
    return res.json({
      hello: 'world',
      users,
      
    });
  });
};
