const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.confirmation_token"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class ConfirmationToken
   * ConfirmationToken model
   * @mixes {import('sequelize/types/model').Model}
   */
  const ConfirmationToken = sequelize.define('ConfirmationToken', {
    token_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    confirmation_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'confirmation_token',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'token_id'},
        ]
      },
      {
        name: 'FKhjrtky9wbd6lbk7mu9tuddqgn',
        using: 'BTREE',
        fields: [
          {name: 'user_id'},
        ]
      },
    ]
  });
  
  return ConfirmationToken;
};
