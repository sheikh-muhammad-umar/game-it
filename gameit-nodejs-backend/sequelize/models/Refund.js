/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.refunds'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Refund}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Refund
   * Refund model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Refund = sequelize.define('Refund', {
    /**
     * ID
     * @memberOf Refund#
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
     * User id
     * @memberOf Refund#
     * @type {number}
     */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'User id',
      field: 'user_id',
    },
    /**
     * Order id
     * @memberOf Refund#
     * @type {number}
     */
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Order id',
      references: {
        model: 'orders',
        key: 'id',
      },
      field: 'order_id',
    },
    /**
     * Status
     * @memberOf Refund#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: 'Status',
    },
    /**
     * Date
     * @memberOf Refund#
     * @type {string}
     */
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date',
    },
    /**
     * Amount
     * @memberOf Refund#
     * @type {number}
     */
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Amount',
    },
    /**
     * Meta data
     * @memberOf Refund#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Refund#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Refund#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'refunds',
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
        name: 'UNQ_refunds_user_id',
        using: 'BTREE',
        fields: [{name: 'user_id'}],
      },
      {
        name: 'UNQ_refunds_order_id',
        using: 'BTREE',
        fields: [{name: 'order_id'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(Refund, [
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
  Refund.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Refund;
};
