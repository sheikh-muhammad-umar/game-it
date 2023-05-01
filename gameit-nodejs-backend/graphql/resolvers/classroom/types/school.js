const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {School} = fastify.db.models;
  defs.Classroom = defs.Classroom || {};
  
  defs.Classroom.school = async ( root, args, ctx, info ) => {
    /** @type {number} */
    const schoolId = op.get( root, 'meta.schoolId' );
    
    if ( !schoolId ) {
      return null;
    }
    
    /** @type {Object} */
    const school = await School.findByPk(schoolId, {
      where: {
        isActive: true,
      },
      raw: true,
    });
    
    return !school
      ? null
      : School.toGraphObject(school);
  }
};
