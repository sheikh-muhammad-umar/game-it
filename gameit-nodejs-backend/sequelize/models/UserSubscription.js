/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.user_subscriptions'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): UserSubscription}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class UserSubscription
   * UserSubscription model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const UserSubscription = sequelize.define('UserSubscription', {
    /**
     * ID
     * @memberOf UserSubscription#
     * @type {number}
     */
     id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'ID'
    },
    /**
     * Subscription
     * @memberOf UserSubscription#
     * @type {number}
     */
     subscriptionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Subscription',
      references: {
        model: 'subscriptions',
        key: 'id'
      },
      field: 'subscription_id',
    },
    /**
     * User
     * @memberOf UserSubscription#
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
     * Meta data
     * @memberOf UserSubscription#
     * @type {object}
     */
     meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data'
    },
    /**
     * Expired At
     * @memberOf UserSubscription#
     * @type {string}
     */
     expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Expired',
      field: 'expired_at',
    },
    /**
     * Created at
     * @memberOf UserSubscription#
     * @type {string}
     */
     createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf UserSubscription#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'user_subscriptions',
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
        name: 'fk_user_subscriptions_user_id_users_id',
        using: 'BTREE',
        fields: [{ name: 'user_id' }],
      },
      {
        name: 'fk_user_subscriptions_subscriptions_1',
        using: 'BTREE',
        fields: [{ name: 'subscription_id' }],
      },
    ],
  });

  /** use-of traits */
  Traits.use(UserSubscription, [
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
  UserSubscription.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };

  return UserSubscription;
};
