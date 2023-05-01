/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.product_types'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): ProductType}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class ProductType
   * ProductType model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const ProductType = sequelize.define('ProductType', {
    /**
     * ID
     * @memberOf ProductType#
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
     * Name
     * @memberOf ProductType#
     * @type {string}
     */
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Name',
    },
    /**
     * Description
     * @memberOf ProductType#
     * @type {string}
     */
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: 'Description',
    },
    /**
     * Status
     * @memberOf ProductType#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: 'Status',
    },
    /**
     * Meta data
     * @memberOf ProductType#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
  }, {
    sequelize,
    tableName: 'product_types',
    timestamps: false,
    paranoid: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
      {
        name: 'IDX_product_types_status',
        using: 'BTREE',
        fields: [{name: 'status'}],
      },
      {
        name: 'UNQ_product_types_name',
        using: 'BTREE',
        fields: [{name: 'name'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(ProductType, [
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
  ProductType.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return ProductType;
};
