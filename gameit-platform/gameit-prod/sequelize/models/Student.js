const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.guardian"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Student
   * Student model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Student = sequelize.define('Student', {
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    NameOfSchool: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Diagnoses: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    CountryLiving: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    CityName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ProfilePicture: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'student',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "StudentID" },
        ]
      },
    ]
  });
  
  return Student;
};
