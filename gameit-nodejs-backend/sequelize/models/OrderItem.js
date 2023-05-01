/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.orderItem'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): OrderItem}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class OrderItem
   * OrderItem model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const OrderItem = sequelize.define('OrderItem', {
    /**
     * ID
     * @memberOf OrderItem#
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
     * Order
     * @memberOf OrderItem#
     * @type {number}
     */
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Order',
      references: {
        model: 'orders',
        key: 'id',
      },
      field: 'order_id',
    },
    /**
     * Product
     * @memberOf OrderItem#
     * @type {number}
     */
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Product',
      references: {
        model: 'products',
        key: 'id',
      },
      field: 'product_id',
    },
    /**
     * Product type
     * @memberOf OrderItem#
     * @type {string}
     */
    productType: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: 'Product type',
      field: 'product_type',
    },
    /**
     * Quantity
     * @memberOf OrderItem#
     * @type {number}
     */
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Quantity',
    },
    /**
     * Coins
     * @memberOf OrderItem#
     * @type {number}
     */
    coins: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins',
    },
    /**
     * Meta data
     * @memberOf OrderItem#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf OrderItem#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf OrderItem#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'order_items',
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
        name: 'UNQ_order_items_order_id',
        using: 'BTREE',
        fields: [{name: 'order_id'}],
      },
      {
        name: 'UNQ_order_items_product_id',
        using: 'BTREE',
        fields: [{name: 'product_id'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(OrderItem, [
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
  OrderItem.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return OrderItem;
};
