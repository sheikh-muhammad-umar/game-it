const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const { User, Classroom} = fastify.db.models;

  defs.Me.schoolAdmin = async ( root, args, ctx, info ) => {
    /** @type {objectPath~ObjectPathBound} */
     const accessor = op(root);

    /** @type {number} */
    const userId = accessor.get('id' );

     // Basic account type checker
     if ( accessor.get('role.type') !== User.ROLE_SCHOOL_ADMIN ) {
      return null;
    }

    //<editor-fold desc="Total Classrooms">
    /** @type {number} */
    const totalClassrooms = await Classroom.count({
      where: {
        ownerId: userId,
      }
    });
    //</editor-fold>

    const response = {
      totalClassrooms: totalClassrooms? totalClassrooms : 0,
    }

    return response;
  }

};
