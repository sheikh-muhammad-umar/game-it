const {Op} = require('sequelize');
const moment = require('moment');

/**
 * Status index controller
 * @param {import('express')} app - Express app instance
 * @param {SequelizeConfig} db - Sequelize mapping
 */
module.exports = ( {app, db} ) => {
  const {User, GameSession, StudentGame,} = db;
  
  app.post('/api/dashboard/stats', async ( req, res ) => {
    const [
      startFrom = moment().utc().subtract(7, 'days').format('YYYY-MM-DD'),
      endTo = moment().utc().format('YYYY-MM-DD'),
    ] = req.body.dateRange || [];
    
    const whereRange = {
      [Op.gte]: startFrom,
      [Op.lte]: endTo,
    };
    
    /** @type {{[string]: number}} */
    const data = {
      studentsCount: 0,
      guardiansCount: 0,
      totalGameDownloads: 0,
      playTime: 0,
    };
    
    try {
      //<editor-fold desc="Query: Students Count">
      data.studentsCount = (
        await User.count({
          where: {
            user_type: User.TYPE_STUDENT,
            last_updated: whereRange,
          },
        })
      ) || 0;
      //</editor-fold>
  
      //<editor-fold desc="Query: Guardians Count">
      data.guardiansCount = (
        await User.count({
          where: {
            user_type: User.TYPE_GUARDIAN,
            last_updated: whereRange,
          },
        })
      ) || 0;
      //</editor-fold>
  
      //<editor-fold desc="Query: Total games download Count">
      data.totalGameDownloads = (
        await GameSession.count({
          col: 'studentid',
          distinct: true,
          where: {Date: whereRange},
        })
      ) || 0;
      //</editor-fold>
  
      //<editor-fold desc="Query: Students total play time">
      data.playTime = (
        await StudentGame.sum('playtime', {
          col: 'studentid',
          where: {CreatedDate: whereRange},
        })
      ) || 0;
      //</editor-fold>
      
    } catch ( e ) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }
    
    return res.send({success: true, data});
  });
};
