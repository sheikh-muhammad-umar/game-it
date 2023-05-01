const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.visitors"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Visitor
   * Visitor model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Visitor = sequelize.define('Visitor', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    emailId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: 'UK6dotkott2kjsp8vw4d0m25fb7'
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'visitors',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ]
      },
      {
        name: 'UK6dotkott2kjsp8vw4d0m25fb7',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'emailId'},
        ]
      },
    ]
  });
  
  return Visitor;
};
