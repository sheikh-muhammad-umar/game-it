const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {User} = fastify.db.models;
  
  defs.Classroom.owner = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const userId = op.get( root, 'meta.ownerId' );
    
    if ( !userId ) {
      return null;
    }
    
    /** @type {Object} */
    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true,
      },
      raw: true,
    });
    
    return !user
      ? null
      : User.toGraphObject(user);
  }
};
