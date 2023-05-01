/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.student_game_goals"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): StudentGameGoal}
 */
module.exports = function (sequelize, DataTypes) {
  /**
   * @class StudentGameGoal
   * StudentGameGoal model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const StudentGameGoal = sequelize.define('StudentGameGoal', {
    /**
     * ID
     * @memberOf StudentGameGoal#
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
     * Student game
     * @memberOf StudentGameGoal#
     * @type {number}
     */
    studentGameId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Student game",
      references: {
        model: 'student_game',
        key: 'id'
      },
      field: 'student_game_id',
    },
    /**
     * Assigner
     * @memberOf StudentGameGoal#
     * @type {number}
     */
    assignerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Assigner",
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'assigner_id',
    },
    /**
     * Student
     * @memberOf StudentGameGoal#
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
     * @memberOf StudentGameGoal#
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
     * Game level
     * @memberOf StudentGameGoal#
     * @type {string}
     */
    gameLevel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "all",
      comment: "Game level",
      field: 'game_level',
    },
    /**
     * Target percentage
     * @memberOf StudentGameGoal#
     * @type {number}
     */
    targetPct: {
      type: DataTypes.DECIMAL(1,1),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Target percentage",
      field: 'target_pct',
    },
    /**
     * Reward (Coins)
     * @memberOf StudentGameGoal#
     * @type {number}
     */
    reward: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "Reward (Coins)"
    },
    /**
     * Status
     * @memberOf StudentGameGoal#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: "Status"
    },
    /**
     * Meta
     * @memberOf StudentGameGoal#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Meta"
    },
    /**
     * Deadline
     * @memberOf StudentGameGoal#
     * @type {string}
     */
    deadlineAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Deadline",
      field: 'deadline_at',
    },
    /**
     * Created at
     * @memberOf StudentGameGoal#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf StudentGameGoal#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'student_game_goals',
    timestamps: true,
    paranoid: true,
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
        name: "UNQ_game_goals_composite_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "assigner_id" },
          { name: "student_id" },
          { name: "game_id" },
          { name: "game_level" },
        ]
      },
      {
        name: "IDX_game_goals_status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
      {
        name: "IDX_game_goals_deadline_at",
        using: "BTREE",
        fields: [
          { name: "deadline_at" },
        ]
      },
      {
        name: "IDX_game_goals_game_level",
        using: "BTREE",
        fields: [
          { name: "game_level" },
        ]
      },
      {
        name: "FK_game_goals_game_id",
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "FK_game_goals_student_id",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
      {
        name: "fk_student_game_goals_student_game_1",
        using: "BTREE",
        fields: [
          { name: "student_game_id" },
        ]
      },
    ]
  });

  /** use-of traits */
  Traits.use(StudentGameGoal, [
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
  StudentGameGoal.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };

  return StudentGameGoal;
};
