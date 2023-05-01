/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table 'gameit_pf_global.states'
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): State}
 */
module.exports = function ( sequelize, DataTypes, fastify ) {
  /**
   * @class State
   * State model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const State = sequelize.define('State', {
    /**
     * ID
     * @memberOf State#
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
     * Name
     * @memberOf State#
     * @type {string}
     */
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Name',
    },
    /**
     * Country Code
     * @memberOf State#
     * @type {string}
     */
    countryCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: 'Country Code',
      field: 'country_code',
    },
    /**
     * Meta data
     * @memberOf State#
     * @type {Object}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta',
    },
  }, {
    sequelize,
    tableName: 'states',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{name: 'id'}],
      },
      {
        name: 'IDX_states_country_code',
        using: 'BTREE',
        fields: [{name: 'country_code'}],
      },
    ],
  });
  
  /** use-of traits */
  Traits.use(State, [
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
  State.prototype.loadDefaults = async function () {
    this.set('meta', {
      nativeName: null,
      i18n: {
        ar_SA: null,
      },
    });
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {State#|Object} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Promise<Object>} - Transformed object
   */
  State.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof State ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      name: accessor.get('name'),
      meta: {
        countryCode: accessor.get('countryCode'),
      },
    };
  };
  
  return State;
};
