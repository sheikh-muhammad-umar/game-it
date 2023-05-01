const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.usertogame"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class UserToGame
   * UserToGame model
   * @mixes {import('sequelize/types/model').Model}
   */
  const UserToGame = sequelize.define('UserToGame', {
    GuardianID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'StudentID_UNIQUE'
    }
  }, {
    sequelize,
    tableName: 'usertogame',
    timestamps: false,
    indexes: [
      {
        name: 'GuardianID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GuardianID'},
        ]
      },
      {
        name: 'StudentID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'StudentID'},
        ]
      },
    ]
  });
  
  return UserToGame;
};
