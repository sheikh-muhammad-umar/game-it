// Utils
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const {TeacherSchool} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Discard pending or expired join school request
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @returns {Promise<(Error|boolean)>}
   * @see Uses `@auth(role: [TEACHER])` directive
   */
  Mutation.discardSchoolRequest = async ( root, {requestId}, ctx ) => {
    const { request } = ctx;

    /** @type {import('sequelize').Model&TeacherSchool#} */
    const req = await TeacherSchool.findOne({
      where: {
        teacherId: fastify.user.id,
        'meta.request.id': requestId,
      },
    });

    //<editor-fold desc="Verify integrity">
    if ( req === null ) {
      throw new RequestError (request.t('Unknown request ID'), 'NOT_FOUND');
    }

    if ( req.getJsonValue('permission') === 'GRANTED' ) {
      throw new RequestError (request.t('Oops! The request is already approved'), 'ALREADY_APPROVED');
    }
    //</editor-fold>

    /** @type {number} */
    const isDeleted = await TeacherSchool.destroy({
      where: {
        teacherId: fastify.user.id,
        'meta.request.id': requestId,
      },
    });

    return Boolean(isDeleted);
  };
};
