const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.gamesession"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class GameSession
   * GameSession model
   * @mixes {import('sequelize/types/model').Model}
   */
  const GameSession = sequelize.define('GameSession', {
    GameSessionID: {
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
    SkillID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LevelID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SessionType: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SessionData: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ScoreEarned: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MinutesInGame: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'gamesession',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GameSessionID'},
        ]
      },
      {
        name: 'GameSessionID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GameSessionID'},
        ]
      },
    ]
  });
  
  return GameSession;
};
