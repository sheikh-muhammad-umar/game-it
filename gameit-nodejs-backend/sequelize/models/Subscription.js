/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.subscriptions'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Subscription}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Subscription
   * Subscription model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Subscription = sequelize.define('Subscription', {
    /**
     * ID
     * @memberOf Subscription#
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
     * @memberOf Subscription#
     * @type {string}
     */
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      comment: 'Name',
    },
    /**
     * Description
     * @memberOf Subscription#
     * @type {string}
     */
    description: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'Description',
    },
    /**
     * Coins
     * @memberOf Subscription#
     * @type {number}
     */
    coins: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Coins',
    },
    /**
     * Validity (days)
     * @memberOf Subscription#
     * @type {number}
     */
    validity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Validity (days)',
    },
    /**
     * Meta data
     * @memberOf Subscription#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Subscription#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Subscription#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'subscriptions',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(Subscription, [
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
  Subscription.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Subscription;
};
