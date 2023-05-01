const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {Classroom} = fastify.db.models;
  
  defs.GuardianInvitation.classroom = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const classroomId = op.get( root, 'meta.classroomId' );
    
    if ( !classroomId ) {
      return null;
    }
    
    /** @type {Object} */
    const classroom = await Classroom.findByPk(classroomId, {
      where: {
        isActive: true,
      },
      raw: true,
    });
    
    return !classroom
      ? null
      : Classroom.toGraphObject(classroom);
  }
};
