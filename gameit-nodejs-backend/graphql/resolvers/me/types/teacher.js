const op = require('object-path');
const graphqlFields = require('graphql-fields');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {User, Classroom, School, TeacherSchool, TeacherStudents} = fastify.db.models;

  defs.Me.teacher = async ( root, args, ctx, info ) => {
    /** @type {Object} */
    const requestedFields = graphqlFields(info);

    /** @type {objectPath~ObjectPathBound} */
    const accessor = op(root);

    // Basic account type checker
    if ( accessor.get('role.type') !== User.ROLE_TEACHER ) {
      return null;
    }

    //<editor-fold desc="Total Classrooms">
    const totalClassrooms = await Classroom.count({
      where: {
        ownerId: accessor.get('id'),
      }
    });
    //</editor-fold>

    //<editor-fold desc="Total Students">
    let totalStudents;
    if(totalClassrooms) {
      totalStudents = await TeacherStudents.count({
        where: {
          teacherId: accessor.get('id'),
        }
      });
    } else {
      totalStudents = 0;
    }
    //</editor-fold>

    const response = {
      totalClassrooms: totalClassrooms? totalClassrooms : 0,
      totalStudents: totalStudents? totalStudents : 0,
      meta: {
        schoolId: null,
        schoolRequestId: null,
        classroomId: null,
      }
    };

    //<editor-fold desc="School meta">
    if ( requestedFields.hasOwnProperty('school') ) {
      /** @type {{id: number}|null} */
      const school = await TeacherSchool.getTeacherDefaultSchool(root.id, {
        attributes: ['id'],
        raw: true,
      });
      response.meta.schoolId = op.get(school, 'id'  , null);
    }
    //</editor-fold>

    //<editor-fold desc="School request meta">
    if ( requestedFields.hasOwnProperty('schoolRequest') ) {
      /** @type {{id: number}|null} */
      const schoolRequest = await TeacherSchool.findPendingByUser(root.id, {
        attributes: ['id'],
        raw: true,
      });
      response.meta.schoolRequestId = op.get(schoolRequest, 'id', null);
    }
    //</editor-fold>

    //<editor-fold desc="Classroom meta">
    if ( requestedFields.hasOwnProperty('classroom') ) {
      /** @type {{id: number}|null} */
      const classroom = await Classroom.findByTeacherId(root.id, {
        attributes: ['id'],
        raw: true,
      });
      response.meta.classroomId = op.get(classroom, 'id', null);
    }
    //</editor-fold>

    return response;
  };

  defs.Teacher.school = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const schoolId = op.get(root, 'meta.schoolId');

    if ( schoolId === null ) {
      return null;
    }

    /** @type {Object} */
    const school = await School.findByPk(schoolId, {
      where: {
        isActive: true,
      },
      raw: true,
    });

    return school === null
      ? null
      : School.toGraphObject(school);
  };

  defs.Teacher.schoolRequest = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const schoolRequestId = op.get(root, 'meta.schoolRequestId');

    if ( schoolRequestId === null ) {
      return null;
    }

    /** @type {Object} */
    const request = await TeacherSchool.findByPk(schoolRequestId, {
      raw: true,
    });

    if ( request === null ) {
      return null;
    }

    return op.get(request, 'meta.permission') === TeacherSchool.PERMISSION_GRANTED
      ? null
      : TeacherSchool.toGraphObject(request);
  };

  defs.Teacher.classroom = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const classroomId = op.get(root, 'meta.classroomId');

    if ( classroomId === null ) {
      return null;
    }

    /** @type {Object} */
    const request = await Classroom.findByPk(classroomId, {
      where: {
        isActive: true,
      },
      raw: true,
    });

    return Classroom.toGraphObject(request);
  };
};
