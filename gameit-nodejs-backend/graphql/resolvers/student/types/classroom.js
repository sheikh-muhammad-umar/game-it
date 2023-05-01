const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {Classroom, ClassStudent} = fastify.db.models;

  defs.Student.classroom = async ( root, args, ctx, info ) => {
    if ( !root.id ) {
      return null;
    }

    /** @type {import('sequelize').Model&ClassStudent#} */
    const model = await ClassStudent.findOne({
      attributes: ['classroomId'],
      where: {
        studentId: root.id,
      },
      include: [{
        model: Classroom,
        as: 'classroom',
      }],
    });

    if ( !model || !model.classroom ) {
      return null;
    }

    return Classroom.toGraphObject(model.classroom);
  };
};