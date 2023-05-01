/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');
const moment = require('moment');
const {recursive} = require('merge');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.shopping_cart"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): ShoppingCart}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class ShoppingCart
   * ShoppingCart model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const ShoppingCart = sequelize.define('ShoppingCart', {
    /**
     * ID
     * @memberOf ShoppingCart#
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
     * @memberOf ShoppingCart#
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
     * Product
     * @memberOf ShoppingCart#
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
     * Quantity
     * @memberOf ShoppingCart#
     * @type {number}
     */
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
      comment: 'Quantity',
    },
    /**
     * Meta
     * @memberOf ShoppingCart#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta',
    },
    /**
     * Created at
     * @memberOf ShoppingCart#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf ShoppingCart#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'shopping_cart',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ],
      },
      {
        name: 'UNQ_shopping_cart_product_user',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'user_id'},
          {name: 'product_id'},
        ],
      },
      {
        name: 'fk_shopping_cart_products_1',
        using: 'BTREE',
        fields: [
          {name: 'product_id'},
        ],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(ShoppingCart, [
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
  ShoppingCart.prototype.loadDefaults = async function () {
    this.set('quantity', 1);
    this.set('meta', {});
  };
  
  /**
   * @async
   * @public
   * @static
   * Check that user has product has in cart or not
   * @param {number} userId - User ID
   * @param {number} productId - Product ID
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @returns {Promise<boolean>}
   */
  ShoppingCart.userHasProduct = async ( {userId, productId}, findOptions = {} ) => {
    return Boolean(
      await ShoppingCart.count(recursive(false, {
        where: {userId, productId},
      }, findOptions)),
    );
  };
  
  /**
   * @async
   * @public
   * @static
   * Remove user's added product from shopping cart
   * @param {number} userId - User ID
   * @param {number} productId - Product ID
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @returns {Promise<boolean>}
   */
  ShoppingCart.removeUserProduct = async ( {userId, productId}, findOptions = {} ) => {
    return Boolean(
      await ShoppingCart.destroy(recursive(false, {
        where: {userId, productId},
      }, findOptions)),
    );
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|ShoppingCart#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  ShoppingCart.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof ShoppingCart ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      quantity: +accessor.get('quantity', 1),
      type: accessor.get('meta.type'),
      coins: accessor.get('meta.coins'),
      addedAt: moment(accessor.get('createdAt')).utc().toISOString(),
      meta: {
        productId: accessor.get('productId'),
      },
    };
  };
  
  return ShoppingCart;
};
