/** Utils */
const RequestError = require('../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const {Classroom, Student, School, Diagnose, ClassStudent, TeacherStudents,} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Create a student
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|Array<Object>>}
   * @see Uses `@auth(role: [TEACHER])` directive
   */
  Mutation.addStudentByTeacher = async ( root, args, ctx, info ) => {
    /** @type {{gradeId: number, dob: Date, fullname: string, diagnoses: JSON, classId: number}} */
    const inputs = args.inputs || {};
    const userId = fastify.user.id;
    const {request} = ctx;
    
    let countDiagnoses = await Diagnose.count({
      where: {
        id: inputs.diagnoses,
        isActive: true,
      },
    });
    
    if ( countDiagnoses !== inputs.diagnoses.length ) {
      throw new RequestError(request.t('Diagnoses ID not found'), 'DIAGNOSES_NOT_FOUND');
    }
    
    if ( !(await Classroom.isClassExists(inputs.classId)) ) {
      throw new RequestError(request.t('Class not found'), 'CLASS_NOT_FOUND');
    }
    
    if ( !(await Classroom.isOwnerOf(inputs.classId, userId)) ) {
      throw new RequestError(request.t('Class ID does not exist'), 'NOT_FOUND');
    }
    
    /** @type {import('sequelize').Model&Student#} */
    const model = Student.build();
    await model.loadDefaults();
    
    const schoolId = await Classroom.getSchoolID(inputs.classId);
    const school = await School.findOne({
      where: {id: schoolId},
      raw: true,
    });
    
    model.set({
      fullName: inputs.fullName,
      dob: inputs.dob,
      grade: inputs.gradeId,
      diagnoses: inputs.diagnoses,
    });
    
    model.setJsonValue('gender', inputs.gender);
    model.setJsonValue('city', school.meta.city);
    model.setJsonValue('countryCode', school.meta.countryCode);
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await ctx.app.db.sequelize.transaction();
    
    try {
      await model.save({transaction});
      
      await addStudentClass(model.get('id'), inputs.classId, schoolId, transaction);
      await addStudentTeacher(model.get('id'), userId, transaction);
      
      await transaction.commit();
      
      return Student.toAssociateGraphObject(model);
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to create student'), 'PROCESS_FAILED');
    }
  };
  
  /**
   * @async
   * @public
   * @static
   * Add student class
   * @param {number} studentId - Student ID
   * @param {number} classroomId - Class ID
   * @param {number} schoolId - School ID
   * @param {import('sequelize').Transaction} transaction - Sequelize Transaction
   */
  const addStudentClass = async ( studentId, classroomId, schoolId, transaction ) => {
    /** @type {import('sequelize').Model&ClassStudent#} */
    const model = ClassStudent.build();
    await model.loadDefaults();
    
    model.set({
      studentId,
      classroomId,
      schoolId,
    });
    
    return model.save({transaction});
  };
  
  /**
   * @async
   * @public
   * @static
   * Add student teacher
   * @param studentId - Student ID
   * @param teacherId - Teacher ID
   * @param transaction - Sequelize Transaction
   */
  const addStudentTeacher = async ( studentId, teacherId, transaction ) => {
    
    /** @type {import('sequelize').Model&TeacherStudents#} */
    const model = TeacherStudents.build();
    await model.loadDefaults();
    
    model.set({
      studentId,
      teacherId,
    });
    
    return model.save({transaction});
  };
};
