/** @namespace SequelizeModels */

const op = require('object-path');
const {recursive} = require('merge');
const {nanoid} = require('nanoid');
const moment = require('moment-timezone');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.teacher_classrooms"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): TeacherSchool}
 */
module.exports = function ( sequelize, DataTypes, fastify ) {
  /**
   * @class TeacherSchool
   * TeacherSchool model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   */
  const TeacherSchool = sequelize.define('TeacherSchool', {
    //<editor-fold desc="Physical columns">
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
      field: 'id',
    },
    teacherId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Teacher user',
      references: {
        model: 'User',
        key: 'id',
      },
      field: 'teacher_id',
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
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta data',
    },
    //</editor-fold>
    //<editor-fold desc="Virtual attributes">
    /**
     * Request ID
     * @readonly
     * @memberOf TeacherSchool#
     * @type {string}
     */
    requestId: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getJsonValue('request.id', null);
      },
      set ( value ) {
        throw new Error('Cannot update readonly attribute');
      },
    },
    //</editor-fold>
  }, {
    sequelize,
    tableName: 'teacher_schools',
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
        name: 'UNQ_teacher_schools_school_id_teacher_user_id',
        unique: true,
        using: 'BTREE',
        fields: [
          {name: 'teacher_id'},
          {name: 'school_id'},
        ],
      },
      {
        name: 'IDX_teacher_schools_teacher_user_id',
        using: 'BTREE',
        fields: [
          {name: 'teacher_id'},
        ],
      },
      {
        name: 'IDX_teacher_schools_school_id',
        using: 'BTREE',
        fields: [
          {name: 'school_id'},
        ],
      },
    ],
  });
  
  // Use of traits
  Traits.use(TeacherSchool, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_ORM_ATTRIBUTES,
    Traits.TRAIT_PAGINATION_CURSOR,
    Traits.TRAIT_PAGINATION_NUMBER,
  ]);
  
  TeacherSchool.PERMISSION_GRANTED = 'GRANTED';
  TeacherSchool.PERMISSION_REJECTED = 'REJECTED';
  TeacherSchool.PERMISSION_DENIED = 'DENIED';
  TeacherSchool.PERMISSION_PENDING = 'PENDING';
  
  /**
   * @async
   * @public
   * @memberOf TeacherSchool#
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  TeacherSchool.prototype.loadDefaults = async function () {
    this.setJsonValue('permission', TeacherSchool.PERMISSION_PENDING);
  };
  
  /**
   * @async
   * @public
   * @memberOf TeacherSchool#
   * Generates a unique request ID
   * @returns {void}
   */
  TeacherSchool.prototype.generateRequestId = function () {
    /** @type {number} */
    const expiryInHours = Number(process.env.TEACHER_SCHOOL_REQUEST_ID_EXPIRY || 24) || 24;
    
    /** @type {string} */
    const expiredAt = moment()
      .add(expiryInHours, 'hours')
      .utc().format('YYYY-MM-DD HH:mm:ss');
    
    this.setJsonValue('request', {
      id: nanoid(16),
      issuedAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      expiredAt,
    });
  };
  
  /**
   * @async
   * @public
   * @memberOf TeacherSchool#
   * Check that request has expired or not
   * @returns {boolean}
   */
  TeacherSchool.prototype.isExpired = function () {
    /** @type {string} */
    const expiredAt = moment(this.getJsonValue('request.expiredAt', '')).utc();
    return moment().utc().isAfter(expiredAt);
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|import('sequelize').Model&TeacherSchool#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  TeacherSchool.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof TeacherSchool ? record.toJSON() : record);
    
    /** @type {'PENDING'|'EXPIRED'} */
    let status = accessor.get('meta.permission', 'PENDING');
    
    /** @type {string} */
    const teacherId = +accessor.get('teacherId');
    
    /** @type {string} */
    const schoolId = accessor.get('schoolId');
    
    /** @type {string} */
    const expiredAt = accessor.get('meta.request.expiredAt');
    
    /** @type {string} */
    const issuedAt = accessor.get('meta.request.issuedAt');
    
    /** @type {string} */
    const completedAt = accessor.get('meta.request.completedAt');
    
    return {
      id: +accessor.get('id'),
      status,
      expiredAt: expiredAt ? moment(expiredAt).utc().toISOString() : null,
      issuedAt: issuedAt ? moment(issuedAt).utc().toISOString() : null,
      completedAt: completedAt ? moment(completedAt).utc().toISOString() : null,
      meta: {
        teacherId,
        schoolId,
      },
    };
  };
  
  /**
   * @async
   * @public
   * @static
   * Get teacher's default school ID
   * @param {number} teacherId - Teacher ID
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<import('sequelize').Model&School|null>}
   */
  TeacherSchool.getTeacherDefaultSchool = async ( teacherId, findOptions = {} ) => {
    const {School} = fastify.db.models;
    
    //<editor-fold desc="Find as Owner">
    /** @type {import('sequelize').Model&School#} */
    const school = await School.findOne(recursive(false, {
      where: {
        isActive: true,
        ownerId: teacherId,
      },
    }, findOptions));
    
    if ( school !== null ) {
      return school;
    }
    //</editor-fold>
    
    const teacherSchool = await TeacherSchool.findOne({
      attributes: ['schoolId'],
      where: {
        teacherId,
      },
      raw: true,
    });
    
    return teacherSchool === null
      ? null
      : School.findOne(recursive(false, {
        where: {
          isActive: true,
          id: teacherSchool.schoolId,
        },
      }, findOptions));
  };
  
  /**
   * @async
   * @public
   * @static
   * Get teacher's pending join school request
   * @param {number} userId - User ID
   * @param {import('sequelize').FindOptions} findOptions={} - Sequelize find options
   * @returns {Promise<import('sequelize').Model&TeacherSchool|null>}
   */
  TeacherSchool.findPendingByUser = async ( userId, findOptions = {} ) => {
    return TeacherSchool.findOne(recursive(false, {
      teacherId: userId,
      'meta.permission': TeacherSchool.PERMISSION_PENDING,
    }, findOptions));
  };
  
  /**
   * @async
   * @public
   * Check that school can be joined or not
   * @param {number} schoolId - School ID
   * @returns {Promise<true>}
   */
  TeacherSchool.canJoinSchool = async ( schoolId ) => {
    const {School} = fastify.db.models;
    
    return School.idExists(schoolId, {where: {isActive: true}});
  };
  
  /**
   * @async
   * @public
   * @static
   * Check that teacher has access to school
   * @param {number} schoolId - School ID
   * @param {number} teacherId - Teacher ID
   * @returns {Promise<true>}
   */
  TeacherSchool.isSchoolOf = async ( schoolId, teacherId ) => {
    const {School, TeacherSchool} = fastify.db.models;
    
    //<editor-fold desc="Check school ownership">
    const schoolOwner = Boolean(
      await School.count({
        where: {
          id: schoolId,
          ownerId: teacherId,
          isActive: true,
        },
      }),
    );
    
    if ( schoolOwner ) {
      return true;
    }
    //</editor-fold>
    
    //<editor-fold desc="Check school permission">
    const hasJoined = Boolean(
      await TeacherSchool.count({
        where: {
          schoolId,
          teacherId,
          'meta.permission': TeacherSchool.PERMISSION_GRANTED,
        },
      }),
    );
    
    return hasJoined;
    //</editor-fold>
  };
  
  /**
   * @async
   * @public
   * Check that teacher can join school or not
   * @param {number} schoolId - School ID
   * @param {number} teacherId - Teacher ID
   * @returns {Promise<true|'NOT_FOUND'|'ALREADY_JOINED'>}
   */
  /*TeacherSchool.canTeacherJoinSchool = async ( schoolId, teacherId ) => {
    const {School, User} = fastify.db.models;
  
    if ( !(await School.idExists(schoolId, {where: {isActive: true}})) ) {
      return 'NOT_FOUND';
    }
  
    if ( !(await School.idExists(schoolId, {where: {isActive: true}})) ) {
      return 'NOT_FOUND';
    }
  };*/
  
  return TeacherSchool;
};

