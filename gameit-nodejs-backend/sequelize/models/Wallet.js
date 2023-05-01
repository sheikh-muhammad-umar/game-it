/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.wallet'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Wallet}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Wallet
   * Wallet model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Wallet = sequelize.define('Wallet', {
    /**
     * ID
     * @memberOf Wallet#
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
     * User
     * @memberOf Wallet#
     * @type {number}
     */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'User',
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    /**
     * Coins
     * @memberOf Wallet#
     * @type {number}
     */
    coins: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'Coins',
    },
    /**
     * Meta data
     * @memberOf Wallet#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Wallet#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Wallet#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'wallets',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
      {
        name: 'fk_wallets_user_id_users_id',
        using: 'BTREE',
        fields: [{name: 'user_id'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(Wallet, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_PAGINATION_NUMBER,
    Traits.TRAIT_PAGINATION_CURSOR,
    Traits.TRAIT_ORM_ATTRIBUTES,
  ]);
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  Wallet.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Wallet;
};
