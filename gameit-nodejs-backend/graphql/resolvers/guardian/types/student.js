const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {Student, TeacherStudents, ClassStudent, User, School, Classroom} = fastify.db.models;
  
  defs.GuardianInvitation.student = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const studentId = op.get( root, 'meta.studentId' );
    
    if ( !studentId ) {
      return null;
    }
    
    /** @type {Object} */
    const student = await Student.findOne({
      where: {
        id: studentId,
      },
      include: [
        {
            model: TeacherStudents,
            as: 'teacher_students',
            required: false,
            attributes: ['teacherId'],
            include: [{
              model: User,
              as: 'user',
              attributes: []
            }],
        },
        {
            model: ClassStudent,
            as: 'class_student',
            attributes: ['schoolId'],
            include: [{
              model: School,
              as: 'school',
              attributes: []
            }],
        },
        {
          model: ClassStudent,
          as: 'class_student',
          required: false,
          attributes: ['classroomId'],
          include: [{
            model: Classroom,
            as: 'classroom',
            attributes: []
          }],
      },
    ],
    raw: true,
    });
    
    return !student
      ? null
      : Student.toAssociateGraphObject(student);
  }
};
