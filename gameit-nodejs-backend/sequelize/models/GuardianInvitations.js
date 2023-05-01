/** @namespace SequelizeModels */

const moment = require('moment');
// const Sequelize = require('sequelize');
// const {Op} = Sequelize;
const op = require('object-path');

// Utils
const Traits = require('./../utils/traits-helper');
const DateTime = require('./../../utils/data/data-time');

/**
 * This is the model class for table "gameit_pf_global.guardian_invitations"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): GuardianInvitation}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class GuardianInvitation
   * GuardianInvitation model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const GuardianInvitation = sequelize.define('GuardianInvitation', {
    /**
     * ID
     * @memberOf GuardianInvitation#
     * @type {number}
     */
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    /**
     * Teacher ID
     * @memberOf GuardianInvitation#
     * @type {number}
     */
    teacherId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Teacher',
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'teacher_id',
    },
    /**
     * Classroom ID
     * @memberOf GuardianInvitation#
     * @type {number}
     */
    classroomId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Class',
      references: {
        model: 'classrooms',
        key: 'id',
      },
      field: 'classroom_id',
    },
    /**
     * Student ID
     * @memberOf GuardianInvitation#
     * @type {number}
     */
    studentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Student',
      references: {
        model: 'students',
        key: 'id',
      },
      field: 'student_id',
    },
    /**
     * Email address
     * @memberOf GuardianInvitation#
     * @type {string}
     */
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email address',
    },
    /**
     * Status
     * @memberOf GuardianInvitation#
     * @type {number}
     */
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 10,
      comment: 'Status',
    },
    /**
     * Meta
     * @memberOf GuardianInvitation#
     * @type {json}
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Meta',
    },
  }, {
    sequelize,
    tableName: 'guardian_invitations',
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
        name: 'IDX_guardian_invitations_email',
        using: 'BTREE',
        fields: [
          {name: 'email'},
        ],
      },
      {
        name: 'IDX_guardian_invitations_status',
        using: 'BTREE',
        fields: [
          {name: 'status'},
        ],
      },
      {
        name: 'fk_guardian_invitations_users_1',
        using: 'BTREE',
        fields: [
          {name: 'teacher_id'},
        ],
      },
      {
        name: 'fk_guardian_invitations_classrooms_1',
        using: 'BTREE',
        fields: [
          {name: 'classroom_id'},
        ],
      },
      {
        name: 'fk_guardian_invitations_students_1',
        using: 'BTREE',
        fields: [
          {name: 'student_id'},
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
  GuardianInvitation.STATUS_PENDING = 3;
  
  /**
   * @readonly
   * @const {number}
   * @default 10
   */
  GuardianInvitation.STATUS_ACCEPTED = 10;
  //</editor-fold>
  
  Traits.use(GuardianInvitation, [
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
  GuardianInvitation.prototype.loadDefaults = async function () {
    this.setJsonValue('meta', {});
  };
  
  /**
   * @async
   * @public
   * @static
   * Check invitation status is equal to given status
   * @param {number} id - Invitation ID
   * @param {number} status - Status (uses: GuardianInvitation.STATUS_*)
   * @return {Promise<null|boolean>} - Null when does not exist / boolean otherwise
   */
  GuardianInvitation.statusIs = async ( id, status = GuardianInvitation.STATUS_PENDING ) => {
    const record = await GuardianInvitation.findOne({
      where: {id},
      attributes: ['status'],
      raw: true,
    });
  
    return !record ? null : record.status === status;
  };
  
  /**
   * @async
   * @public
   * Check if email exists
   * @returns {Promise<boolean>}
   */
  GuardianInvitation.emailExists = async ( email ) => {
    return Boolean(
      await GuardianInvitation.count({
        where: {
          email,
        },
      }));
  };
  
  /**
   * @async
   * @public
   * Update Guardian Invitation Status
   * @returns {Promise<void>}
   */
  GuardianInvitation.updateStatus = async ( email ) => {
    
    const model = await GuardianInvitation.findOne({
      where: {
        email,
      },
    });
    if ( model ) {
      model.set({
        status: 3,
      });
      model.removeJsonPath('expiredAt');
      model.removeJsonPath('inviteCode');
      model.setJsonValue('completedAt', DateTime.timestamp());
      model.save();
      console.log('completedAt', DateTime.timestamp());
    }
  };
  
  /**
   * @async
   * @public
   * Get Student IDs of Guardian
   * @returns {Promise<array>}
   */
  GuardianInvitation.getGuardianRelatedStudents = async ( email ) => {
    
    const model = await GuardianInvitation.findAll({
      where: {
        email,
      },
      attributes: ['studentId'],
      raw: true,
    });
    if ( model ) {
      let Ids = model.map(a => a.studentId);
      return Ids;
    }
    return [];
  };
  
  /**
   * @public
   * @static
   * Transform raw record into graphql object
   * @param {Object|GuardianInvitation#} record - Record to transform
   * @param {string} language=null - The Locale ISO to localize data (e.g., ur-PK)
   * @return {Object} - Transformed object
   */
  GuardianInvitation.toGraphObject = async ( record, language = null ) => {
    /** @type {objectPath.ObjectPathBound} */
    const accessor = op(record instanceof GuardianInvitation ? record.toJSON() : record);
    
    const completedAt = accessor.get('meta.completedAt') ? moment(accessor.get('meta.completedAt')).utc().toISOString() : null;
    const requestedAt = accessor.get('meta.requestedAt') ? moment(accessor.get('meta.requestedAt')).utc().toISOString() : null;
    const expiredAt = accessor.get('meta.expiredAt') ? moment(accessor.get('meta.expiredAt')).utc().toISOString() : null;
    const status = +accessor.get('status') == 10 ? 'PENDING' : 'GRANTED';
    
    return {
      id: +accessor.get('id'),
      status,
      email: accessor.get('email'),
      completedAt,
      expiredAt,
      requestedAt,
      meta: {
        studentId: accessor.get('studentId'),
        classroomId: accessor.get('classroomId'),
      },
      // TODO: Add fields
    };
  };
  
  return GuardianInvitation;
};
