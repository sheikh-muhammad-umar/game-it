/** @namespace SequelizeModels */
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.skills"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Skill}
 */
module.exports = function (sequelize, DataTypes) {
  /**
   * @class Skill
   * Skill model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Skill = sequelize.define('Skill', {
    /**
     *  ID
     * @memberOf Skill#
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
     * Name
     * @memberOf Skill#
     * @type {sting}
     */
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      comment: "Name",
      unique: "UNQ_skills_name"
    },
    /**
     * Description
     * @memberOf Skill#
     * @type {sting}
     */
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Description"
    },
    /**
     * Meta
     * @memberOf Skill#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Meta"
    }
  }, {
    sequelize,
    tableName: 'skills',
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
        name: "UNQ_skills_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });

  /** use-of traits */
  Traits.use(Skill, [
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
  Skill.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };

  Skill.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof Skill ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      name:language !== 'en-US' ? accessor.get('meta')[language].name: accessor.get('name'),
      description: language !== 'en-US' ? accessor.get('meta')[language].description: accessor.get('description'),
    };
  };
  return Skill;
};
