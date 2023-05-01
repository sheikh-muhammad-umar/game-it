/** @namespace SequelizeModels */

const {recursive} = require('merge');
const moment = require('moment');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {invertObj: R_invertObj} = require('ramda');

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.class_students"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): Classroom}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class ClassStudent
   * @memberOf SequelizeModels
   * Class Students model
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const ClassStudent = sequelize.define('ClassStudent', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'ID',
    },
    schoolId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'School',
      references: {
        model: 'schools',
        key: 'id',
      },
      field: 'school_id',
    },
    classroomId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'Classroom',
      references: {
        model: 'classrooms',
        key: 'id',
      },
      field: 'classroom_id',
    },
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
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Meta',
    },
  }, {
    sequelize,
    tableName: 'class_students',
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
        name: 'IDX_class_students_student_id',
        using: 'BTREE',
        fields: [
          {name: 'student_id'},
        ],
      },
      {
        name: 'IDX_class_students_school_id',
        using: 'BTREE',
        fields: [
          {name: 'school_id'},
        ],
      },
      {
        name: 'IDX_class_students_classroom_id',
        using: 'BTREE',
        fields: [
          {name: 'classroom_id'},
        ],
      },
    ],
  });
  
  Traits.use(ClassStudent, [
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
  ClassStudent.prototype.loadDefaults = async function () {
    this.set({});
    this.setJsonValue('meta', {});
  };
  
  /**
   * @async
   * @public
   * Check if student exists in classroom
   * @returns {Promise<boolean>}
   */
  ClassStudent.hasStudent = async ( classroom_id, student_id ) => {
    return Boolean(
      await ClassStudent.count({
        where: {
          classroom_id,
          student_id,
        },
      }),
    );
  };
  
  /**
   * @async
   * @public
   * Get classroom details by studentID
   * @returns {Promise<object>}
   */
  ClassStudent.getClassroom = async ( student_id ) => {
    const classStudent = await ClassStudent.findOne({
      where: {
        student_id,
      },
      attribute: ['classroomId', 'schoolId'],
      raw: true,
    });
    return classStudent;
  };
  
  return ClassStudent;
};