const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.skilltolevel"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class SkillToLevel
   * SkillToLevel model
   * @mixes {import('sequelize/types/model').Model}
   */
  const SkillToLevel = sequelize.define('skilltolevel', {
    SkillID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LevelID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'skilltolevel',
    timestamps: false
  });
  
  return SkillToLevel;
};
