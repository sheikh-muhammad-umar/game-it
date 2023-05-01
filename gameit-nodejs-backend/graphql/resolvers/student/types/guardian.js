const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {User} = fastify.db.models;
  
  defs.Student.guardian = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const userId = op.get(root, 'meta.guardianId');
    
    if ( !userId ) {
      return null;
    }
    
    /** @type {Object} */
    const user = await User.findByPk(userId, {
      where: {
        isActive: true,
      },
      raw: true,
    });
    
    return !user
      ? null
      : User.toGraphObject(user);
  };
};
