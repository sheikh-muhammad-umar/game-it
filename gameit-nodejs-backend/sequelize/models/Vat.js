/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
// const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.vat'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Vat}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Vat
   * Vat model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Vat = sequelize.define('Vat', {
    /**
     * ID
     * @memberOf Vat#
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
     * Country
     * @memberOf Vat#
     * @type {string}
     */
    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: 'Country',
      field: 'country_code',
    },
    /**
     * Percentage
     * @memberOf Vat#
     * @type {number}
     */
    percentage: {
      type: DataTypes.DECIMAL(2, 2),
      allowNull: false,
      comment: 'Percentage',
    },
    /**
     * Status
     * @memberOf Vat#
     * @type {number}
     */
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      comment: 'Status',
    },
    /**
     * Meta data
     * @memberOf Vat#
     * @type {object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    /**
     * Created at
     * @memberOf Vat#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Vat#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'vats',
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
  Traits.use(Vat, [
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
  Vat.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  return Vat;
};
