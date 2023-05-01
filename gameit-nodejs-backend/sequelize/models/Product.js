/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');
const moment = require('moment');
const {recursive} = require('merge');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.product'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Product}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Product
   * Product model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Product = sequelize.define('Product', {
    /**
     * ID
     * @memberOf Product#
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
     * Product type
     * @memberOf Product#
     * @type {number}
     */
    productTypeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Product type',
      references: {
        model: 'product_types',
        key: 'id',
      },
      field: 'product_type_id',
    },
    /**
     * Name
     * @memberOf Product#
     * @type {string}
     */
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: 'Name',
      unique: 'UNQ_producet_name',
    },
    /**
     * Coins
     * @memberOf Product#
     * @type {number}
     */
    coins: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins',
    },
    /**
     * Meta data
     * @memberOf Product#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Product#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Product#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'products',
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
        name: 'UNQ_producet_name',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'name'}],
      },
      {
        name: 'IDX_producet_coins',
        using: 'BTREE',
        fields: [{name: 'coins'}],
      },
      {
        name: 'fk_products_product_types_1',
        using: 'BTREE',
        fields: [{name: 'product_type_id'}],
      },
    ],
  });
  
  Product.VISIBILITY_PUBLIC = 'public';
  Product.VISIBILITY_PRIVATE = 'private';
  
  /** use-of traits */
  Traits.use(Product, [
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
  Product.prototype.loadDefaults = async function () {
    this.set('meta', {});
    this.setJsonValue('visibility', 'public');
  };
  
  /**
   * @async
   * @public
   * @static
   * Check that product id exists
   * @param {number} id - Product ID
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @return {Object} - Transformed object
   */
  Product.idExists = async ( id, findOptions = {} ) => {
    return Boolean(
      await Product.count(recursive(true, {
        where: {
          id,
          'meta.visibility': Product.VISIBILITY_PUBLIC,
        },
      }, findOptions)),
    );
  };
  
  /**
   * @async
   * @public
   * @static
   * Find product by given ID
   * @param {number} id - Product ID
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @return {Object|null}
   */
  Product.findById = async ( id, findOptions = {} ) => {
    return Product.findOne(recursive(true, {
      where: {
        id,
        'meta.visibility': Product.VISIBILITY_PUBLIC,
      },
    }, findOptions));
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|Product#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  Product.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof Product ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      name: accessor.get('name'),
      createdAt: moment(accessor.get('createdAt')).utc().toISOString(),
      meta: {
        productTypeId: accessor.get('productTypeId'),
      },
    };
  };
  
  return Product;
};
