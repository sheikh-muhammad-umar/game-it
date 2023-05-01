/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.agreement'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Agreement}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Agreement
   * Agreement model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Agreement = sequelize.define('Agreement', {
    /**
     * ID
     * @memberOf Agreement#
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
     * Heading
     * @memberOf Agreement#
     * @type {string}
     */
    heading: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'Heading',
    },
    /**
     * Content
     * @memberOf Agreement#
     * @type {string}
     */
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Content',
    },
    /**
     * Version
     * @memberOf Agreement#
     * @type {string}
     */
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Version',
    },
    /**
     * Meta data
     * @memberOf Agreement#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Agreement#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Agreement#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'agreements',
    timestamps: true,
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
  Traits.use(Agreement, [
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
  Agreement.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Agreement;
};
