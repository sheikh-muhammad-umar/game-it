const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.level"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Level
   * Level model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Level = sequelize.define('Level', {
    LevelID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LevelName: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'level',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'LevelID'},
        ]
      },
    ]
  });
  
  return Level;
};
