const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {Student, StudentGame} = fastify.db.models;
  defs.Game.students = async ( root, args, ctx, info ) => {
    /** @type {number} */

    const gameId = op.get( root, 'id' );
    const userId = fastify.user.id;

    if ( !gameId ) {
      return null;
    }

    /** @type {Object} */
    const gameStudents = await StudentGame.findAll({
      where: {
        gameId: gameId
      },
      attributes: ['studentId'],
    raw: true,
    });
    
    if ( !gameStudents ) {
      return null;
    } 
    
    /** @type {Array} */
    const students = [];
 
    for(let gameStudent of gameStudents){
      studentId= gameStudent.studentId;

      /** @type {Object} */
      const student = await Student.findOne({
        where: {
          id: studentId,
          'meta.guardian.id': userId
        },
      raw: true,
      });

      if ( student ) {
        students.push(
          Student.toAssociateGraphObject(student)
        )
      } 
      
  }
    
    return !students
      ? null
      : students;
  }
};
