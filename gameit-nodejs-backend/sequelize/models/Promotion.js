/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.promotions'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Promotion}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Promotion
   * Promotion model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Promotion = sequelize.define('Promotion', {
    /**
     * ID
     * @memberOf Promotion#
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
     * Label
     * @memberOf Promotion#
     * @type {string}
     */
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Label',
    },
    /**
     * Code
     * @memberOf Promotion#
     * @type {string}
     */
    code: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: 'Code',
    },
    /**
     * Discount (Total)
     * @memberOf Promotion#
     * @type {number}
     */
    discountTotal: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: 'Discount (Total)',
      field: 'discount_total',
    },
    /**
     * Discount (Percent)
     * @memberOf Promotion#
     * @type {number}
     */
    discountRate: {
      type: DataTypes.DECIMAL(2, 0),
      allowNull: true,
      comment: 'Discount (Percent)',
      field: 'discount_rate',
    },
    /**
     * Validity from
     * @memberOf Promotion#
     * @type {string}
     */
    validityFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Validity from',
      field: 'validity_from',
    },
    /**
     * Validity to
     * @memberOf Promotion#
     * @type {string}
     */
    validityTo: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Validity to',
      field: 'validity_to',
    },
    /**
     * Meta data
     * @memberOf Promotion#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Promotion#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Promotion#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'promotions',
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
        name: 'UNQ_promotions_label',
        using: 'BTREE',
        fields: [{name: 'label'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(Promotion, [
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
  Promotion.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Promotion;
};
