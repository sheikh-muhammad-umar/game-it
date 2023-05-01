/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.invoices'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Invoice}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Invoice
   * Invoice model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Invoice = sequelize.define('Invoice', {
    /**
     * ID
     * @memberOf Invoice#
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
     * @memberOf Invoice#
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
     * Order
     * @memberOf Invoice#
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
     * Type
     * @memberOf Invoice#
     * @type {string}
     */
    type: {
      type: DataTypes.ENUM('RESIDENTIAL', 'COMMERCIAL'),
      allowNull: false,
      comment: 'Type',
      
    },
    /**
     * Bill (address)
     * @memberOf Invoice#
     * @type {object}
     */
    billTo: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Bill (address)',
      field: 'bill_to',
    },
    /**
     * Meta data
     * @memberOf Invoice#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Invoice#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Invoice#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
      {
        name: 'fk_users_id_invoices_user_id',
        using: 'BTREE',
        fields: [{name: 'user_id'}],
      },
      {
        name: 'fk_invoices_orders_1',
        using: 'BTREE',
        fields: [{name: 'order_id'}],
      },
    ],
  });
  
  //<editor-fold desc='Type constants'>
  /**
   * @readonly
   * @const {string}
   * @default 'RESIDENTIAL'
   */
  Invoice.TYPE_RESIDENTIAL = 'RESIDENTIAL';
  
  /**
   * @readonly
   * @const {string}
   * @default 'COMMERCIAL'
   */
  Invoice.TYPE_COMMERCIAL = 'COMMERCIAL';
  //</editor-fold>
  
  /** use-of traits */
  Traits.use(Invoice, [
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
  Invoice.prototype.loadDefaults = async function () {
    this.set('type', Invoice.TYPE_COMMERCIAL);
    this.set('meta', {});
  };
  
  return Invoice;
};
