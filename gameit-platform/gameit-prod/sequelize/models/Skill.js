const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.skill"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Skill
   * Skill model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Skill = sequelize.define('Skill', {
    SkillID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    SkillName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SkillDescription: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'skill',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SkillID" },
        ]
      },
      {
        name: "SkillID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SkillID" },
        ]
      },
    ]
  });
  
  return Skill;
};
