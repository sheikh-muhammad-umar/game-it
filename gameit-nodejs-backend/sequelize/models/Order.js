/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.order'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Order}
 */
module.exports = function ( sequelize, DataTypes, fastify ) {
  /**
   * @class Order
   * Order model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Order = sequelize.define('Order', {
     /**
     * ID
     * @memberOf Order#
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
     * @memberOf Order#
     * @type {number}
     */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'User',
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id',
    },
     /**
     * Agreement
     * @memberOf Order#
     * @type {number}
     */
    agreementId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Agreement',
      references: {
        model: 'agreements',
        key: 'id'
      },
      field: 'agreement_id',
    },
     /**
     * VAT
     * @memberOf Order#
     * @type {number}
     */
    vatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'VAT',
      references: {
        model: 'vats',
        key: 'id'
      },
      field: 'vat_id',
    },
     /**
     * Payment Status
     * @memberOf Order#
     * @type {number}
     */
    paymentStatus: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: 'Payment Status',
      field: 'payment_status',
    },
     /**
     * Payment Method
     * @memberOf Order#
     * @type {string}
     */
    paymentMethod: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: 'Payment Method',
      field: 'payment_method',
    },
     /**
     * Coins (Total)
     * @memberOf Order#
     * @type {number}
     */
    coinsTotal: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins (Total)',
      field: 'coins_total',
    },
     /**
     * Coins (discount)
     * @memberOf Order#
     * @type {number}
     */
    coinsDiscount: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins (discount)',
      field: 'coins_discount',
    },
     /**
     * Coins (payable)
     * @memberOf Order#
     * @type {number}
     */
    coinsPayable: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins (payable)',
      field: 'coins_payable',
    },
     /**
     * Meta data
     * @memberOf Order#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
     /**
     * Payment Processed
     * @memberOf Order#
     * @type {string}
     */
    paymentProcessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Payment Processed',
      field: 'payment_processed_at',
    },
    /**
     * Created at
     * @memberOf Order#
     * @type {string}
     */
     createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Order#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
      {
        name: 'FK_orders_order_id_users_id',
        using: 'BTREE',
        fields: [{ name: 'user_id' }],
      },
      {
        name: 'fk_orders_agreements_1',
        using: 'BTREE',
        fields: [{ name: 'agreement_id' }],
      },
      {
        name: 'fk_orders_vats_1',
        using: 'BTREE',
        fields: [{ name: 'vat_id' }],
      },
    ],
  });

    /** use-of traits */
    Traits.use(Order, [
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
    Order.prototype.loadDefaults = async function () {
      this.set('meta', {});
    };

  return Order;
};
