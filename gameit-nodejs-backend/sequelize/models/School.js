/** @namespace SequelizeModels */

//const Sequelize = require('sequelize');
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');

// Utils
const {isValidCode} = require('./../../utils/data/country');
const {recursive} = require('merge');

/**
 * This is the model class for table "gameit_pf_global.schools"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): School}
 */
module.exports = function ( sequelize, DataTypes, fastify ) {
  /**
   * @class School
   * School model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes UserSecurityTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const School = sequelize.define('School', {
    //<editor-fold desc="Physical columns">
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
    },
    ownerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Owner',
      references: {
        model: 'User',
        key: 'id',
      },
      field: 'owner_id',
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: 'Name',
      unique: 'UNQ_schools_name',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: 'Active',
      field: 'is_active',
    },
    /**
     * Created at
     * @memberOf School#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf School#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    //</editor-fold>
    
    //<editor-fold desc="Virtual attributes">
    city: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getJsonValue('city', null);
      },
      set ( value ) {
        this.setJsonValue('city', value);
      },
    },
    countryCode: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getJsonValue('countryCode', null);
      },
      set ( value ) {
        this.setJsonValue('countryCode', value);
      },
    },
    //</editor-fold>
  }, {
    sequelize,
    tableName: 'schools',
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
        name: 'UNQ_schools_name',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'name'},
        ],
      },
      {
        name: 'IDX_schools_owner_id',
        using: 'BTREE',
        fields: [
          {name: 'owner_id'},
        ],
      },
    ],
    validate: {
      cityRule () {
        if ( this.get('city') === null || !this.get('city').trim() ) {
          throw new Error('City is required');
        }
      },
      countryCodeRule () {
        if ( this.get('countryCode') === null || !this.get('countryCode').trim() ) {
          throw new Error('Country code is required');
        }
        if ( !isValidCode(this.get('countryCode')) ) {
          throw new Error('Invalid country code');
        }
      },
    },
  });
  
  Traits.use(School, [
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
  School.prototype.loadDefaults = async function () {
    this.set({isActive: true});
    this.setJsonValue('city', null);
    this.setJsonValue('countryCode', null);
  };
  
  /**
   * @async
   * @public
   * Get school owner model
   * @returns {Promise<import('sequelize').Model&User#|Object|null>}
   */
  School.prototype.getOwner = async function ( findOptions = {} ) {
    return fastify.db.models.User.findOne(recursive(false, {
      where: {id: this.get('ownerId')},
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf School.
   * Get school's name by ID
   * @param {number} id - PK
   * @returns {Promise<?string>} / Null when not found / otherwise name
   */
  School.getName = async id => {
    /** @type {?({name: string})} */
    const record = await School.findOne({
      where: {
        id,
      },
      attributes: ['name'],
      raw: true,
    });
    
    return !record ? null : record.name;
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf School.
   * Check that given pk exists
   * @param {number} id - School ID
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<boolean>}
   */
  School.idExists = async ( id, findOptions = {} ) => {
    return Boolean(await School.count(recursive(false, {
      where: {
        id,
      },
    }, findOptions)));
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf School.
   * Check that given name exists
   * @param {string} name - School name
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<boolean>}
   */
  School.nameExists = async ( name, findOptions = {} ) => {
    return Boolean(await School.count(recursive(false, {
      where: {
        name,
      },
    }, findOptions)));
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|School#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  School.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof School ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      name: accessor.get('name'),
      city: accessor.get('meta.city'),
      country: accessor.get('meta.countryCode'),
      meta: {
        ownerId: accessor.get('ownerId'),
      },
      // TODO: Add fields
    };
  };
  
  return School;
};

