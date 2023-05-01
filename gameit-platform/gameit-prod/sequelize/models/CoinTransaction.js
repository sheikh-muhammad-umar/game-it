const Sequelize = require('sequelize');

/**
 * This is the model class for table "gameit-pf.cointransaction"
 * @param {import('sequelize/types/index').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @return {function(): Object}
 */
module.exports = ( sequelize, DataTypes ) => {
  /**
   * @class CoinTransaction
   * CoinTransaction model
   * @mixes {import('sequelize/types/model').Model}
   */
  const CoinTransaction = sequelize.define('CoinTransaction', {
    CoinTransactionID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FromUserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ToUserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AmountOfCoins: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    TransactionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Reason: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cointransaction',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'CoinTransactionID'},
        ]
      },
      {
        name: 'TransactionID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'CoinTransactionID'},
        ]
      },
    ]
  });
  
  return CoinTransaction;
};
