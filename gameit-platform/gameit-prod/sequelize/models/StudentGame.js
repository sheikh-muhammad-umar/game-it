const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.studentgame"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class StudentGame
   * StudentGame model
   * @mixes {import('sequelize/types/model').Model}
   */
  const StudentGame = sequelize.define('StudentGame', {
    StudentGameID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GameID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    playTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    GameSessionKey: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    InstallationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Instructions: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    InstructionsLanguages: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentgame',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'StudentGameID'},
        ]
      },
      {
        name: 'StudentGameID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'StudentGameID'},
        ]
      },
    ]
  });
  
  return StudentGame;
};
