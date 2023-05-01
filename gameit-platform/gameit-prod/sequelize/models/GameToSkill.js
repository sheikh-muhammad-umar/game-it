const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.gametoskill"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class GameToSkill
   * GameToSkill model
   * @mixes {import('sequelize/types/model').Model}
   */
  const GameToSkill = sequelize.define('GameToSkill', {
    GameID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SkillID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'gametoskill',
    timestamps: false
  });
  
  return GameToSkill;
};
