/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.walletHistory'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): WalletHistory}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class WalletHistory
   * WalletHistory model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const WalletHistory = sequelize.define('WalletHistory', {
    /**
     * ID
     * @memberOf WalletHistory#
     * @type {number}
     */
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'ID',
    },
    /**
     * Wallet ID
     * @memberOf WalletHistory#
     * @type {number}
     */
    walletId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: 'Wallet',
      references: {
        model: 'wallets',
        key: 'id',
      },
      field: 'wallet_id',
    },
    /**
     * Category
     * @memberOf WalletHistory#
     * @type {number}
     */
    category: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Category',
    },
    /**
     * Transaction Type
     * @memberOf WalletHistory#
     * @type {string}
     */
    transactionType: {
      type: DataTypes.ENUM('CREDIT', 'DEBIT'),
      allowNull: false,
      comment: 'Transaction Type',
      field: 'transaction_type',
    },
    /**
     * Coins
     * @memberOf WalletHistory#
     * @type {number}
     */
    coins: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: 'Coins',
    },
    /**
     * Meta data
     * @memberOf WalletHistory#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf WalletHistory#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf WalletHistory#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'wallet_history',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
      {
        name: 'fk_wallet_history_wallets_1',
        using: 'BTREE',
        fields: [{name: 'wallet_id'}],
      },
    ],
  });

  //<editor-fold desc='Role/Type constants'>
  /**
   * @readonly
   * @const {string}
   * @default 'CREDIT'
   */
  WalletHistory.TYPE_TRANSACTION = 'CREDIT';
  
  /**
   * @readonly
   * @const {string}
   * @default 'DEBIT'
   */
  WalletHistory.TYPE_TRANSACTION = 'DEBIT';
  //</editor-fold>
  
  /** use-of traits */
  Traits.use(WalletHistory, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_PAGINATION_NUMBER,
    Traits.TRAIT_PAGINATION_CURSOR,
    Traits.TRAIT_TYPE_ATTRIBUTE,
    Traits.TRAIT_ORM_ATTRIBUTES,
  ]);
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  WalletHistory.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return WalletHistory;
};
