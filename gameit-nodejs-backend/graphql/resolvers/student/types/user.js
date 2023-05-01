const op = require('object-path');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  const {User, TeacherStudents} = fastify.db.models;
  
  defs.Student.teacher = async ( root, args, ctx, info ) => {

    if ( !root.id ) {
      return null;
    }
    // test webhook
    // /** @type {Object} */
    // const user = await User.findOne({
    //   where: {
    //     id: root.id,
    //     isActive: true,
    //   },
    // });

    /** @type {import('sequelize').Model&ClassStudent#} */
    const model = await TeacherStudents.findOne({
      attributes: ['teacherId'],
      where: {
        studentId: root.id,
      },
      include: [{
        model: User,
        as: 'teacher',
      }],
    });

    if ( !model || !model.user ) {
      return null;
    }

    return User.toGraphObject(model.user);
  }

};
