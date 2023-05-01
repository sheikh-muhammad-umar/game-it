const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.studentmilestone"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class StudentMilestone
   * StudentMilestone model
   * @mixes {import('sequelize/types/model').Model}
   */
  const StudentMilestone = sequelize.define('StudentMilestone', {
    StudentMilestoneID: {
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
    MilestoneID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'studentmilestone',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'StudentMilestoneID'},
        ]
      },
      {
        name: 'StudentMilestoneID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'StudentMilestoneID'},
        ]
      },
    ]
  });
  
  return StudentMilestone;
};
