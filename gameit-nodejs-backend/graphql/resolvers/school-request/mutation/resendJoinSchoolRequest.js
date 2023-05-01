// Utils
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const Mailer = require('./../../../../utils/mailer')(fastify);
  const {School, User, TeacherSchool} = fastify.db.models;
  
  /**
   * @public
   * @async
   * (Mutation) Handle join school request
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @returns {Promise<(Error|boolean)>}
   * @see Uses `@auth(role: [TEACHER])` directive
   */
  Mutation.resendJoinSchoolRequest = async ( root, {requestId}, ctx ) => {
    /** @type {import('sequelize').Model&TeacherSchool#} */
    const request = await TeacherSchool.findOne({
      where: {
        teacherId: fastify.user.id,
        'meta.request.id': requestId,
      },
      include: [{
        model: School, as: 'school',
        attributes: ['id', 'ownerId', 'name'],
        include: [{
          model: User, as: 'owner',
          attributes: ['id', 'fullName', 'email', 'username'],
        }],
      }, {
        model: User, as: 'teacher',
        attributes: ['id', 'fullName', 'email', 'username', 'language'],
      }],
    });
    
    //<editor-fold desc="Verify integrity">
    if ( request === null ) {
      throw new RequestError(ctx.request.t('Unknown request ID'), 'NOT_FOUND');
    }
    
    if ( request.getJsonValue('permission', 'PENDING') === 'GRANTED' ) {
      throw new RequestError(ctx.request.t('Oops! The request is already approved'), 'ALREADY_APPROVED');
    }
    
    if ( !request.isExpired() ) {
      throw new RequestError(ctx.request.t('Cannot send request because it\'s not expired yet'), 'NOT_EXPIRED');
    }
    //</editor-fold>
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await fastify.db.sequelize.transaction();
    
    request.generateRequestId();
    
    try {
      await request.save({transaction});
      
      await Mailer.getInstance().sendEmailTemplate('school_join_request', [{
        name: request.school.owner.fullName,
        email: request.school.owner.email,
      }], {
        language: request.teacher.language,
        variables: {
          firstname: request.school.owner.fullName,
          schoolName: request.school.name,
          teacherName: request.teacher.fullName,
          requestId: request.requestId,
        },
      });
      
      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.error(e.message, e);
      throw new RequestError(ctx.request.t('Failed to send joining school request'), 'PROCESS_FAILED');
    }
  };
};
