const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.class"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Class
   * Class model
   * @type {import('sequelize/types/model').Model}
   */
  const Class = sequelize.define('Class', {
    ClassID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NumberOfStudents: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SchoolName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ClassName: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'class',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'ClassID'},
        ]
      },
      {
        name: 'ClassID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'ClassID'},
        ]
      },
    ]
  });
  
  return Class;
};
