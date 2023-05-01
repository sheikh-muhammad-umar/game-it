/** @namespace SequelizeModels */

const Sequelize = require('sequelize');
//const {Op} = Sequelize;

// Utils
//const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.diagnoses"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Diagnose}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Diagnose
   * Diagnose model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Diagnose = sequelize.define('Diagnose', {
    /**
     * ID
     * @memberOf Diagnose#
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
     * Title
     * @memberOf Diagnose#
     * @type {string}
     */
    title: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: 'Title',
      unique: 'UNQ_diagnoses_title',
    },
    /**
     * Description
     * @memberOf Diagnose#
     * @type {string}
     */
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Description',
    },
    /**
     * isActive
     * @memberOf Diagnose#
     * @type {number}
     */
    isActive: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
      comment: 'Active',
      field: 'is_active',
    },
    /**
     * Meta
     * @memberOf Diagnose#
     * @type {json}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta',
    },
  }, {
    sequelize,
    tableName: 'diagnoses',
    timestamps: false,
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
        name: 'UNQ_diagnoses_title',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'title'},
        ],
      },
    ],
  });
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  Diagnose.prototype.loadDefaults = async function () {
    this.setJsonValue('meta', {});
  };
  
  /**
   * @async
   * @public
   * @static
   * Check if Diagnoses ID exists
   * @param {number} id - Diagnoses ID
   * @returns {Promise<boolean>}
   */
  Diagnose.idExists = async ( id ) => {
    const {Diagnose} = fastify.db.models;
    
    //<editor-fold desc="Check if Diagnoses ID exists">
    return Boolean(
      await Diagnose.count({
        where: {
          id,
          isActive: true,
        },
      }),
    );
    //</editor-fold>
  };
  
  return Diagnose;
};
