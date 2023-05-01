const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const { Student, User } = fastify.db.models;

  defs.Me.guardian = async ( root, args, ctx, info ) => {
    /** @type {objectPath~ObjectPathBound} */
     const accessor = op(root);

    /** @type {number} */
    const userId = accessor.get('id' );

     // Basic account type checker
     if ( accessor.get('role.type') !== "GUARDIAN" ) {
      return null;
    }

    /** @type {Object} */
    const totalChildren = await Student.count({
      where: {
        'meta.guardian.id': userId,
      }
    });

    const response = {
      totalChildren: totalChildren? totalChildren : 0,
    }

    return response;
  }

};
