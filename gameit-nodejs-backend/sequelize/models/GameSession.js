/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.game_sessions"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): GameSession}
 */
module.exports = function (sequelize, DataTypes) {
  /**
   * @class GameSession
   * GameSession model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const GameSession = sequelize.define('GameSession', {
    /**
     * ID
     * @memberOf GameSession#
     * @type {number}
     */
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "ID",
    },
    /**
     * Student
     * @memberOf GameSession#
     * @type {number}
     */
    studentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Student",
      references: {
        model: 'students',
        key: 'id'
      },
      field: 'student_id',
    },
    /**
     * Game
     * @memberOf GameSession#
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
     * Type
     * @memberOf GameSession#
     * @type {string}
     */
    type: {
      type: DataTypes.STRING(15),
      allowNull: false,
      comment: "Type",
    },
    /**
     * Game session key
     * @memberOf GameSession#
     * @type {string}
     */
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Game session key",
    },
    /**
     * Data
     * @memberOf GameSession#
     * @type {Object}
     */
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Data",
    },
    /**
     * Meta
     * @memberOf GameSession#
     * @type {Object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Meta",
    },
    /**
     * Created at
     * @memberOf GameSession#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf GameSession#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'game_sessions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          {name: "id"},
        ],
      },
      {
        name: "IDX_game_sessions_student_id",
        using: "BTREE",
        fields: [
          {name: "student_id"},
        ],
      },
      {
        name: "IDX_game_sessions_game_id",
        using: "BTREE",
        fields: [
          {name: "game_id"},
        ],
      },
    ]
  });

  /** use-of traits */
  Traits.use(GameSession, [
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
  GameSession.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };

  /**
   * @async
   * @public
   * Check if game session is started
   * @returns {Promise<boolean>}
   */
  GameSession.isStarted = async function (key) {
    return Boolean(
      await GameSession.count({
        where: {
          type: "start",
          key
        }
      })
    );
  }

  /**
   * @async
   * @public
   * Check if game session is in progress
   * @returns {Promise<boolean>}
   */
  GameSession.isInProgress = async function (key) {
    return Boolean(
      await GameSession.count({
        where: {
          type: "progress",
          key
        }
      })
    );
  }

  GameSession.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof GameSession ? record.toJSON() : record);

    return {
      id: +accessor.get('id'),
      studentId:accessor.get('studentId'),
      gameId:accessor.get('gameId'),
      type:accessor.get('type'),
      sessionId: accessor.get('data').sessionId,
      data: accessor.get('data'),
    };

  };

  return GameSession;
};
