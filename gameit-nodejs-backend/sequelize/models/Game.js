/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.games"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Game}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Game
   * Game model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Game = sequelize.define('Game', {
    /**
     * ID
     * @memberOf Game#
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
     * Title
     * @memberOf Game#
     * @type {string}
     */
    title: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: "Title",
      unique: "UNQ_games_title",
    },
    /**
     * Description
     * @memberOf Game#
     * @type {string}
     */
    description: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: "Description",
    },
    /**
     * Skill
     * @memberOf Game#
     * @type {string}
     */
     skillId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "Skill (ID)",
      field: 'skill_id',
    },
    /**
     * Skill
     * @memberOf Game#
     * @type {string}
     */
    skillTitle: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: "Skill (title)",
      field: 'skill_title',
    },
    /**
     * Skill
     * @memberOf Game#
     * @type {string}
     */
    skillDescription: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: "Skill (description)",
      field: 'skill_description',
    },
    /**
     * App
     * @memberOf Game#
     * @type {object}
     */
    app: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "App (meta)",
    },
    /**
     * Levels
     * @memberOf Game#
     * @type {object}
     */
    levels: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Levels",
    },
    /**
     * Status
     * @memberOf Game#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 10,
      comment: "Status",
    },
    /**
     * Meta
     * @memberOf Game#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Meta data",
    },
    /**
     * Created at
     * @memberOf Game#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Game#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'games',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ],
      },
      {
        name: "UNQ_games_title",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "title" },
        ],
      },
      {
        name: "IDX_games_skill_id",
        using: "BTREE",
        fields: [
          { name: "skill_id" },
        ],
      },
      {
        name: "IDX_games_skill_title",
        using: "BTREE",
        fields: [
          { name: "skill_title" },
        ],
      },
      {
        name: "IDX_games_status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ],
      },
      {
        name: 'fk_games_skills_1',
        using: 'BTREE',
        fields: [
          {name: 'skill_id'},
        ],
      },
    ],
  });

  //<editor-fold desc="Status constants">
  /**
   * @readonly
   * @const {number}
   * @default 3
   */
   Game.STATUS_FREE = 3;
  
   /**
    * @readonly
    * @const {number}
    * @default 10
    */
   Game.STATUS_AVAILABLE = 10;

   /**
    * @readonly
    * @const {number}
    * @default 19
    */
   Game.STATUS_UPCOMING = 19;

   //</editor-fold>

  /** use-of traits */
  Traits.use(Game, [
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
  Game.prototype.loadDefaults = async function () {
    this.set({ meta: {}, });
  };

  Game.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof Game ? record.toJSON() : record);
    let status = '';

    if (accessor.get('status') == Game.STATUS_AVAILABLE) {
      status = 'AVAILABLE';
    }
    
    else if (accessor.get('status') == Game.STATUS_FREE) {
      status = 'FREE';
    }

    else if (accessor.get('status') == Game.STATUS_UPCOMING) {
      status = 'UPCOMING';
    }

    return {
      id: +accessor.get('id'),
      title:language !== 'en-US' ? accessor.get('meta')[language].title: accessor.get('title'),
      description: language !== 'en-US' ? accessor.get('meta')[language].description: accessor.get('description'),
      skill_id: accessor.get('skillId'),
      skill_title: language !== 'en-US' ? accessor.get('meta')[language].skill.title: accessor.get('skillTitle'),
      skill_description: language !== 'en-US' ? accessor.get('meta')[language].skill.description: accessor.get('skillDescription'),
      app: accessor.get('app'),
      levels: accessor.get('levels'),
      status,
    };
  };

  return Game;
};
