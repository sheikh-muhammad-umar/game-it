const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.guardiantostudent"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class GuardianToStudent
   * GuardianToStudent model
   * @mixes {import('sequelize/types/model').Model}
   */
  const GuardianToStudent = sequelize.define('GuardianToStudent', {
    GuardianToStudentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    StudentID: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'guardiantostudent',
    timestamps: false
  });
  
  return GuardianToStudent;
};
