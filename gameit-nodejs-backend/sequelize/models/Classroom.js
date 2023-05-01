/** @namespace SequelizeModels */

//const Sequelize = require('sequelize');
const op = require('object-path');
const {recursive} = require('merge');
const {customAlphabet} = require('nanoid');
const classCodeGenerate = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.classrooms"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Classroom}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class Classroom
   * Classroom model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const Classroom = sequelize.define('Classroom', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
      field: 'id',
    },
    schoolId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'School',
      references: {
        model: 'School',
        key: 'id',
      },
      field: 'school_id',
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
      field: 'name',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: 'Active',
      field: 'is_active',
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
      field: 'meta',
    },
    /**
     * Created at
     * @memberOf Classroom#
     * @type {string}
     */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    /**
     * Updated at
     * @memberOf Classroom#
     * @type {string}
     */
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
    //</editor-fold>
    //<editor-fold desc="Virtual attributes">
    /**
     * Class code
     * @readonly
     * @memberOf Classroom#
     * @type {string}
     */
    code: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getJsonValue('code', null);
      },
      set ( value ) {
        throw new Error('Cannot update readonly attribute');
      },
    },
    /**
     * Grade
     * @memberOf Classroom#
     * @type {string}
     */
    grade: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getJsonValue('grade', null);
      },
      set ( value ) {
        this.setJsonValue('grade', value);
      },
    },
    //</editor-fold>
  }, {
    sequelize,
    tableName: 'classrooms',
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
        name: 'IDX_classrooms_owner_id',
        using: 'BTREE',
        fields: [
          {name: 'owner_id'},
        ],
      },
    ],
  });
  
  Traits.use(Classroom, [
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
  Classroom.prototype.loadDefaults = async function () {
    this.set({isActive: true});
    this.setJsonValue('grade', null);
    this.setJsonValue('code', null);
  };
  
  /**
   * @async
   * @public
   * Generate a unique class code
   * @see nanoid.customAlphabet
   * @memberOf {Classroom}
   * @returns {Promise<string>}
   */
  Classroom.prototype.generateClassCode = async function () {
    /** @type {string} */
    const code = classCodeGenerate(6);
    
    /** @type {boolean} */
    const exists = Boolean(
      await Classroom.count({where: {'meta.code': code}}),
    );
    
    if ( !exists ) {
      this.setJsonValue('code', code);
      return code;
    } else {
      return await this.generateClassCode();
    }
  };
  
  /**
   * @async
   * @public
   * @static
   * Get Classroom of given teacher ID
   * @param {number} teacherId - Teacher ID
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<import('sequelize').Model&Classroom|Object|null>}
   */
  Classroom.findByTeacherId = async ( teacherId, findOptions ) => {
    return Classroom.findOne(recursive(false, {
      teacherId,
    }, findOptions));
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|Classroom#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  Classroom.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof Classroom ? record.toJSON() : record);
    
    return {
      id: +accessor.get('id'),
      name: accessor.get('name'),
      grade: +accessor.get('meta.grade'),
      code: accessor.get('meta.code'),
      meta: {
        ownerId: accessor.get('ownerId'),
        schoolId: accessor.get('schoolId'),
      },
    };
  };
  
  /**
   * @async
   * @public
   * @static
   * Get School ID
   * @param {number} classId - Class ID
   * @returns {Promise<number>}
   */
  Classroom.getSchoolID = async ( classId ) => {
    
    //<editor-fold desc="Get school ID">
    const model = await Classroom.findOne({
      where: {
        id: classId,
        isActive: true,
      },
      attributes: ['schoolId'],
      raw: true,
    });
    
    if ( model ) {
      return model.schoolId;
    } else {
      return null;
    }
    //</editor-fold>
    
  };
  
  /**
   * @async
   * @public
   * @static
   * Check that class of school exists
   * @param {number} classId - Class ID
   * @returns {Promise<true | false>}
   */
  Classroom.isClassExists = async ( classId ) => {
    //<editor-fold desc="Check class">
    return Boolean(
      await Classroom.count({
        where: {
          id: classId,
          isActive: true,
        },
      }),
    );
    //</editor-fold>
  };
  
  /**
   * @async
   * @public
   * @static
   * Check that given user is a classroom owner or not
   * @param {number} classId - Class ID
   * @param {number} ownerId - Owner user ID
   * @returns {Promise<boolean>}
   */
  Classroom.isOwnerOf = async ( classId, ownerId ) => {
    return Boolean(
      await Classroom.count({
        where: {
          id: classId,
          ownerId,
          isActive: true,
        },
      }),
    );
  };
  
  return Classroom;
};