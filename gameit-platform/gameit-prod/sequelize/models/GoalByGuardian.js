const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.goalbyguardian"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class GoalByGuardian
   * GoalByGuardian model
   * @mixes {import('sequelize/types/model').Model}
   */
  const GoalByGuardian = sequelize.define('GoalByGuardian', {
    GoalByGuardianID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AssignerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AssigneeID: {
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
    TargetGoal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TimeFrame: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CoinTransactionID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'goalbyguardian',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GoalByGuardianID'},
        ]
      },
      {
        name: 'GoalByGuardianID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GoalByGuardianID'},
        ]
      },
    ]
  });
  
  return GoalByGuardian;
};
