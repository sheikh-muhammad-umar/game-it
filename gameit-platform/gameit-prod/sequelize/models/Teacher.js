const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.teacher"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Teacher
   * Teacher model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Teacher = sequelize.define('Teacher', {
    TeacherID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ClassID: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'teacher',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'TeacherID'},
        ]
      },
      {
        name: 'TeacherID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'TeacherID'},
        ]
      },
    ]
  });
  
  return Teacher;
};
