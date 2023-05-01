/** @namespace SequelizeModels */

// const Sequelize = require('sequelize');
// const {Op} = Sequelize;

// Utils
const Traits = require('./../utils/traits-helper');

/**
 * This is the model class for table "gameit_pf_global.TeacherStudents"
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @param {import('sequelize/types/data-types')} DataTypes - Sequelize data types
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify - Fastify server instance
 * @return {function(): TeacherStudents}
 */
module.exports = function ( sequelize, DataTypes ) {
  /**
   * @class TeacherStudents
   * TeacherStudents model
   * @memberOf SequelizeModels
   * @mixes {import('sequelize').Model}
   * @mixes GeneralMethodsTrait
   * @mixes JsonbTrait
   * @mixes TypeTrait
   * @mixes TeacherStudents SecurityTrait
   * @mixes CursorPaginationTrait
   * @mixes NumberPaginationTrait
   */
  const TeacherStudents = sequelize.define('TeacherStudents', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'ID',
    },
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
    tableName: 'teacher_students',
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
        name: 'fk_teacher_students_students_1',
        using: 'BTREE',
        fields: [
          {name: 'student_id'},
        ],
      },
    ],
  });
  
  /** use-of traits */
  require('./traits/UserSecurity')(TeacherStudents);
  Traits.use(TeacherStudents, [
    Traits.TRAIT_JSON_ATTRIBUTE,
    Traits.TRAIT_PAGINATION_NUMBER,
    Traits.TRAIT_PAGINATION_CURSOR,
    Traits.TRAIT_TYPE_ATTRIBUTE,
    Traits.TRAIT_ORM_ATTRIBUTES,
  ]);
  
  /**
   * @async
   * @public
   * Loads default values while initializing model
   * @returns {Promise<void>}
   */
  TeacherStudents.prototype.loadDefaults = async function () {
    this.setJsonValue('meta', {});
  };
  
  return TeacherStudents;
};
