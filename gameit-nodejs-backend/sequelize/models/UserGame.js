/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');
const {recursive} = require('merge');

// Utils
const Traits = require('../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.user_games"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): UserGame}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class UserGame
   * UserGame model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const UserGame = sequelize.define('UserGame', {
    /**
     * ID
     * @memberOf UserGame#
     * @type {number}
     */
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "ID"
    },
    /**
     * Guardian
     * @memberOf UserGame#
     * @type {number}
     */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Guardian",
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id',
    },
    /**
     * Game
     * @memberOf UserGame#
     * @type {number}
     */
    gameId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Game",
      references: {
        model: 'games',
        key: 'id'
      },
      field: 'game_id',
    },
    /**
     * Status
     * @memberOf UserGame#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: "Status"
    },
    /**
     * Meta
     * @memberOf UserGame#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Meta data"
    },
    /**
     * Created at
     * @memberOf UserGame#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf UserGame#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'user_games',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UNQ_user_games_composite",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "game_id" },
        ]
      },
      {
        name: "IDX_user_games_status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
      {
        name: "FK_user_games_games_id_game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
    ]
  });

  /** use-of traits */
  Traits.use(UserGame, [
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
  UserGame.prototype.loadDefaults = async function () {
    this.set({meta: {}});
  };

  /**
   * @async
   * @public
   * Get User Game By SessionKey
   * @param {string} key - Session key
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @returns {Promise<?(import('sequelize').Model<UserGame>)>}
   */
  UserGame.findBySessionKey = async ( key, findOptions = {} ) => {
    return UserGame.findOne(recursive(false, {
      where: {sessionKey: key},
    }, findOptions));
  };

  return UserGame;
};
