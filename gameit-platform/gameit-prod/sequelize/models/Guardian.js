const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.guardian"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class Guardian
   * Guardian model
   * @mixes {import('sequelize/types/model').Model}
   */
  const Guardian = sequelize.define('Guardian', {
    GuardianID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    PhoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Payment: {
      type: DataTypes.STRING(45),
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'guardian',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GuardianID'},
        ],
      },
      {
        name: 'GuardianID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'GuardianID'},
        ],
      },
    ],
  });
  
  return Guardian;
};
