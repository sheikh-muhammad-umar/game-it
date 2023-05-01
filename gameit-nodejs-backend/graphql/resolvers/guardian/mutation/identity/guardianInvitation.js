const moment = require('moment-timezone');

// Data utils
const DateTime = require('./../../../../../utils/data/data-time');
const {verificationCode} = require('./../../../../../utils/data/randomizer');

// Utils
const RequestError = require('./../../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const Mailer = require('../../../../../utils/mailer')(fastify);
  const {GuardianInvitation, ClassStudent, User, Student, School} = fastify.db.models;
  
  /**
   * @public
   * @async
   * (Mutation) Send invitation by teacher to guardian to join platform
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<void>}
   */
  Mutation.guardianInvitation = async ( root, args, ctx, info ) => {
    /**
     * @type {Object}
     * @property {string} email - Username
     * @property {number} studentId - Username
     */
    const inputs = args.inputs;
    const teacherId = fastify.user.id;
    const {request} = ctx;
    const {email, studentId} = inputs;
    const {classroomId = null, schoolId = null} = await ClassStudent.getClassroom(studentId);
    
    //<editor-fold desc="Check invitation status">
    const invitation = await GuardianInvitation.findOne({
      where: {
        email,
        studentId,
        classroomId,
        teacherId,
      },
      attributes: ['status'],
      raw: true,
    });
    
    if ( !Student.guardianExists(studentId) ) {
      throw new RequestError(request.t('Student guardian already exist'), 'GUARDIAN_ALREADY_EXIST');
    }

    if ( invitation && invitation.status === GuardianInvitation.STATUS_PENDING ) {
      throw new RequestError(request.t('Invitation is already sent'), 'INVITATION_ALREADY_SENT');
    }
    
    if ( invitation && invitation.status === GuardianInvitation.STATUS_ACCEPTED ) {
      throw new RequestError(request.t('Invitation is already accepted'), 'INVITATION_ALREADY_ACCEPTED');
    }
    //</editor-fold>
    
    /** @type {import('sequelize').Model&GuardianInvitation#} */
    const model = GuardianInvitation.build();
    await model.loadDefaults();
    
    model.set({
      email,
      studentId,
      teacherId,
      classroomId,
      status: GuardianInvitation.STATUS_PENDING,
    });
    
    /** @type {string} */
    const schoolName = await School.getName(schoolId);
    /** @type {string} */
    const teacherName = await User.getName(teacherId);
    /** @type {string} */
    const studentName = await Student.getName(studentId);
    
    //<editor-fold desc="Invitation acceptance related">
    /** @type {number} */
    const expiryInHours = Number(process.env.USER_SIGNUP_CODE_EXPIRY || 72) || 72;
    
    /** @type {string} */
    const inviteCode = verificationCode();
    /** @type {string} */
    const expiredAt = moment()
      .add(expiryInHours, 'hours')
      .utc().format('YYYY-MM-DD HH:mm:ss');
    
    model.setJsonValue('requestedAt', DateTime.timestamp());
    model.setJsonValue('expiredAt', expiredAt);
    model.setJsonValue('inviteCode', inviteCode);
    //</editor-fold>
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await ctx.app.db.sequelize.transaction();
    
    try {
      // Reflect changes
      await model.save({transaction});
      
      // Send verification email
      await Mailer.getInstance().sendEmailTemplate('guardian_invitation_by_teacher', [{
        name: 'Guardian', email: model.get('email'),
      }], {
        language: 'en-US',
        variables: {
          schoolName,
          email,
          teacherName,
          studentName,
          code: inviteCode,
        },
      });
      
      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process invitation request'), 'PROCESS_FAILED');
    }
  };
};
