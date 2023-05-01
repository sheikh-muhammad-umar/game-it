const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {GuardianInvitation} = fastify.db.models;
  
  defs.Student.guardianInvitation = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const studentId = op.get(root, 'id');
    
    if ( !studentId ) {
      return null;
    }
    
    /** @type {Object} */
    const guardianInvitation = await GuardianInvitation.findOne({
      where: {
        studentId,
        // isActive: true,
      },
      raw: true,
    });
    
    return !guardianInvitation
      ? null
      : GuardianInvitation.toGraphObject(guardianInvitation);
  };
};
