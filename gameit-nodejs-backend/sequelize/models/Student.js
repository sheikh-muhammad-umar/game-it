/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;

// Utils
const Traits = require('./../utils/traits-helper');
const op = require('object-path');

/**
 * This is the model class for table "gameit_pf_global.students"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Students}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Students
   * Students model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Student = sequelize.define('Student', {
    /**
     * ID
     * @memberOf Student#
     * @type {number}
     */
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
      field: 'id',
    },
    /**
     * Fullname
     * @memberOf Student#
     * @type {string}
     */
    fullName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      comment: 'Full name',
      field: 'fullname',
    },
    /**
     * Grade
     * @memberOf Student#
     * @type {number}
     */
    grade: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Grade',
      field: 'grade',
    },
    /**
     * DOB
     * @memberOf Student#
     * @type {date}
     */
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date of birth',
      field: 'dob',
    },
    /**
     * Diagnoses
     * @memberOf Student#
     * @type {json}
     */
    diagnoses: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Diagnoses',
      defaultValue: [],
    },
    /**
     * Meta
     * @memberOf Student#
     * @type {json}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Metadata',
    },
    /**
     * Created at
     * @memberOf Student#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Student#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  }, {
    sequelize,
    tableName: 'students',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'id'},
        ],
      },
    ],
  });
  
  Traits.use(Student, [
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
  Student.prototype.loadDefaults = async function () {
    this.set('meta', {});
  };
  
  /**
   * @public
   * Returns an ID that can uniquely identify a student identity.
   * @returns {number|null}
   */
  Student.prototype.getId = function () {
    const [id] = [...Student.primaryKeyAttributes].splice(0, 1);
    
    /** @type {number} */
    const PK = +this.get(id);
    
    return !PK || isNaN(PK) ? null : PK;
  };
  
  /**
   * @public
   * Get student's first name
   * @returns {string}
   */
  Student.prototype.getFirstName = function () {
    return this.get('fullName').split(' ')[0];
  };
  
  /**
   * @async
   * @public
   * Add Guardian
   * @returns {Promise<void>}
   */
  Student.addGuardian = async function ( id ) {
    
    this.setJsonValue('guardian', id);
  };
  
  /**
   * @async
   * @public
   * @static
   * @memberOf Student.
   * Get student's fullname by ID
   * @param {number} id - PK
   * @returns {Promise<?string>} / Null when not found / otherwise fullname
   */
  Student.getName = async id => {
    /** @type {?({name: string})} */
    const record = await Student.findByPk(id, {
      attributes: [['fullName', 'name']],
      raw: true,
    });
    
    return !record ? null : record.name;
  };
  
  /**
   * @async
   * @public
   * Check if username exists
   * @param {string} username - Username of Student
   * @returns {Promise<boolean>}
   */
  Student.usernameExists = async function ( username ) {
    return Boolean(
      await Student.count({
        where: {'meta.username': username},
      }),
    );
  };
  
  /**
   * @async
   * @public
   * Check if email exists
   * @param {string} email - Email of Student
   * @returns {Promise<boolean>}
   */
  Student.emailExists = async function ( email ) {
    return Boolean(
      await Student.count({
        where: {'meta.email': email},
      }),
    );
  };

  /**
   * @async
   * @public
   * Check if student has guardian
   * @param {string} id - ID of Student
   * @returns {Promise<boolean>}
   */
  Student.guardianExists = async function ( id ) {
    const model = await Student.findOne({
      where: { id },
      raw: true,
    });

    return model.meta.guardian.id? true : false;
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|Student#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  Student.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof Student ? record.toJSON() : record);
    
    const grade = accessor.get('grade') ? accessor.get('grade') : null;
    
    return {
      id: +accessor.get('id'),
      fullName: accessor.get('fullName'),
      grade,
      dob: accessor.get('dob'),
      diagnoses: accessor.get('diagnoses'),
    };
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|Student#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  Student.toAssociateGraphObject = async ( record, language = null ) => {
    /** @type {Object} */
    const row = record instanceof Student ? record.toJSON() : record;
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(row);
    
    return {
      id: +accessor.get('id'),
      fullName: accessor.get('fullName'),
      grade: accessor.get('grade'),
      dob: accessor.get('dob'),
      diagnoses: accessor.get('diagnoses', []),
      meta: {
        guardianId: accessor.get('meta.guardian.id'),
      },
    };
  };
  
  return Student;
};