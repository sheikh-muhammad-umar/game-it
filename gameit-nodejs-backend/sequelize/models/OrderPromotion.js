/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.orderPromotion'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): OrderPromotion}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class OrderPromotion
   * OrderPromotion model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const OrderPromotion = sequelize.define('OrderPromotion', {
    /**
     * ID
     * @memberOf OrderPromotion#
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
     * @memberOf OrderPromotion#
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
     * Promotion
     * @memberOf OrderPromotion#
     * @type {number}
     */
    promotionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Promotion',
      references: {
        model: 'promotions',
        key: 'id',
      },
      field: 'promotion_id',
    },
    /**
     * Meta data
     * @memberOf OrderPromotion#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf OrderPromotion#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf OrderPromotion#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'order_promotion',
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
        name: 'fk_order_promotion_promotions_1',
        using: 'BTREE',
        fields: [{name: 'promotion_id'}],
      },
      {
        name: 'fk_order_promotion_orders_1',
        using: 'BTREE',
        fields: [{name: 'order_id'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(OrderPromotion, [
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
  OrderPromotion.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  
  return OrderPromotion;
};
