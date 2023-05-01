/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');
const {recursive} = require('merge');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.student_games"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): StudentGame}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class StudentGame
   * StudentGame model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const StudentGame = sequelize.define('StudentGame', {
    /**
     * ID
     * @memberOf StudentGame#
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
     * Assigner User
     * @memberOf StudentGame#
     * @type {number}
     */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Assigner User',
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'assigner_id',
    },
    /**
     * Student
     * @memberOf StudentGame#
     * @type {number}
     */
    studentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Student',
      references: {
        model: 'students',
        key: 'id',
      },
      unique: 'UNQ_student_games_game_id_student_id_session_key',
      field: 'student_id',
    },
    /**
     * Game
     * @memberOf StudentGame#
     * @type {number}
     */
    gameId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Game',
      references: {
        model: 'games',
        key: 'id',
      },
      unique: 'UNQ_student_games_game_id_student_id_session_key',
      field: 'game_id',
    },
    /**
     * Session Key
     * @memberOf StudentGame#
     * @type {string}
     */
    sessionKey: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: 'Session Key',
      unique: 'UNQ_student_games_session_key',
      field: 'session_key',
    },
    /**
     * Instructions
     * @memberOf StudentGame#
     * @type {string}
     */
    instructions: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Instructions',
    },
    /**
     * Status
     * @memberOf StudentGame#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: 'Status',
    },
    /**
     * Meta
     * @memberOf StudentGame#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta',
    },
    /**
     * Created at
     * @memberOf StudentGame#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf StudentGame#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'student_games',
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
        name: 'UNQ_student_games_game_id_student_id_session_key',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'game_id'},
          {name: 'student_id'},
          {name: 'session_key'},
        ],
      },
      {
        name: 'UNQ_student_games_session_key',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'session_key'},
        ],
      },
      {
        name: 'IDX_student_games_student_id',
        using: 'BTREE',
        fields: [
          {name: 'student_id'},
        ],
      },
      {
        name: 'IDX_student_games_game_id',
        using: 'BTREE',
        fields: [
          {name: 'game_id'},
        ],
      },
      {
        name: 'IDX_student_games_user_id',
        using: 'BTREE',
        fields: [
          {name: 'user_id'},
        ],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(StudentGame, [
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
  StudentGame.prototype.loadDefaults = async function () {
    this.set({meta: {}});
  };
  
  /**
   * @async
   * @public
   * Check if username exists
   * @param {string} username - Username of Student
   * @returns {Promise<boolean>}
   */
   StudentGame.gameExists = async function (studentId, gameId ) {
    return Boolean(
      await StudentGame.count({
        where: {
            studentId: studentId,
            gameId: gameId
          },
      }),
    );
  };


  /**
   * @async
   * @public
   * Get Student Game By SessionKey
   * @param {string} key - Session key
   * @param {import('sequelize').FindOptions} [findOptions={}] - Sequelize find options
   * @returns {Promise<?(import('sequelize').Model<StudentGame>)>}
   */
  StudentGame.findBySessionKey = async ( key, findOptions = {} ) => {
    return StudentGame.findOne(recursive(false, {
      where: {sessionKey: key},
    }, findOptions));
  };
  
  return StudentGame;
};
