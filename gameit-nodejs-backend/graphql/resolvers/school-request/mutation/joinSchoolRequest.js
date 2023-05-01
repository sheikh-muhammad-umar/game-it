const moment = require('moment');

// Utils
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const Mailer = require('./../../../../utils/mailer')(fastify);
  const {User, School, TeacherSchool} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Handle join school request
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @returns {Promise<(Error|boolean)>}
   * @see Uses `@auth(role: [SCHOOL_ADMIN])` directive
   */
  Mutation.joinSchoolRequest = async ( root, {permission, requestId}, ctx ) => {
    /** @type {import('sequelize').Model<TeacherSchool>&TeacherSchool#} */
    const request = await TeacherSchool.findOne({
      where: {
        'meta.request.id': requestId,
      },
      include: [{
        model: School, as: 'school',
        attributes: ['id', 'ownerId', 'name'],
      }, {
        model: User, as: 'teacher',
        attributes: ['id', 'fullName', 'email', 'username', 'language'],
      }],
    });

    //<editor-fold desc="Verify integrity">
    if ( request === null ) {
      throw new RequestError (ctx.request.t('Unknown request ID'), 'NOT_FOUND');
    }

    if ( +request.school.ownerId !== +fastify.user.id ) {
      throw new RequestError (ctx.request.t('You don\'t have permission to access this request'), 'ACCESS_DENIED');
    }

    if ( request.isExpired() ) {
      throw new RequestError (ctx.request.t('The request has been expired'), 'REQUEST_EXPIRED');
    }

    if ( request.getJsonValue('permission') === 'GRANTED' ) {
      throw new RequestError (ctx.request.t('Oops! The request is already approved'), 'ALREADY_APPROVED');
    }
    //</editor-fold>

    const {fullName, email, language} = request.teacher;

    /** @type {import('sequelize').Transaction} */
    const transaction = await fastify.db.sequelize.transaction();
    
    /** @type {string} */
    const templateLabel = permission === 'GRANTED'
      ? 'school_join_request_accepted'
      : 'school_join_request_rejected';
    
    if ( permission === 'GRANTED' ) {
      request.removeJsonPath('request.expiredAt');
      request.removeJsonPath('request.id');
      request.setJsonValue('permission', TeacherSchool.PERMISSION_GRANTED);
      request.setJsonValue('request.completedAt', moment().utc().format('YYYY-MM-DD HH:mm:ss'));
    } else {
      request.setJsonValue('permission', TeacherSchool.PERMISSION_REJECTED);
      request.setJsonValue('request.rejectedAt', moment().utc().format('YYYY-MM-DD HH:mm:ss'));
    }

    try {
      await request.save({transaction});

      await Mailer.getInstance().sendEmailTemplate(templateLabel, [{
        name: fullName, email,
      }], {
        language: language,
        variables: {
          firstname: request.teacher.name,
          username: request.teacher.username,
          schoolName: request.school.name,
        }
      });

      await transaction.commit();
    } catch ( e ) {
      console.error(e.message, e);
      throw new RequestError(ctx.request.t('Failed to process join school request'), 'PROCESS_FAILED');
    }
  };
};
