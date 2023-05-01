const moment = require('moment-timezone');

// Data utils
const DateTime = require('./../../../../../utils/data/data-time');
const {verificationCode} = require('./../../../../../utils/data/randomizer');

// Utils
const RequestError = require('./../../../../components/RequestError');

/**
 * @typedef SignupInputFields
 * @type {Object}
 * @property {string} role - User role
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} country - Country name
 * @property {{schoolId: ?number, name: ?string, city: ?string}} school
 */

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const Mailer = require('../../../../../utils/mailer')(fastify);
  
  const {User, School, TeacherSchool, GuardianInvitation} = fastify.db.models;
  
  //<editor-fold desc="Register school">
  const registerSchool = async ( {inputs, ownerId, transaction} ) => {
    /** @type {import('sequelize').Model&School#} */
    const school = School.build();
    school.loadDefaults();
    
    school.set({
      ownerId,
      name: inputs.school.name,
      city: inputs.school.city,
      countryCode: inputs.country,
    });
    
    return school.save({transaction});
  };
  //</editor-fold>
  
  //<editor-fold desc="Request school access permission">
  const requestSchoolAccess = async ( {inputs, model, transaction} ) => {
    /** @type {import('sequelize').Model&TeacherSchool#} */
    const request = TeacherSchool.build();
    await request.loadDefaults();
    request.set({
      teacherId: model.get('id'),
      schoolId: inputs.school.id,
    });
    
    request.generateRequestId();
    
    await request.save({transaction});

    const school = await School.findOne({
      where: {id: inputs.school.id},
      attributes: ['ownerId', 'name'],
      include: [{model: User, as: 'owner', attributes: ['fullname', 'email']}],
      raw: true,
    });
    
    await Mailer.getInstance().sendEmailTemplate('school_join_request',
      [{
        name: school['owner.fullname'], email: school['owner.email'],
      }], {
        language: model.get('language'),
        variables: {
          firstname: school['owner.fullname'],
          schoolName: school['name'],
          teacherName: model.get('fullName'),
          requestId: request.requestId,
        },
      });
  };
  //</editor-fold>
  
  const registerSchoolOrRequestAccess = async ( {inputs, model, transaction} ) => {
    if ( ![User.ROLE_SCHOOL_ADMIN, User.ROLE_TEACHER].includes(inputs.role) ) {
      return;
    }
  
    return inputs?.school?.id
      ? requestSchoolAccess({inputs, model, transaction})
      : registerSchool({inputs, ownerId: model.id, transaction});
  };
  
  /**
   * @public
   * @async
   * (Mutation) Create a new user account
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|Array<Object>>}s
   * @see Uses `@guest` directive
   */
  Mutation.signUp = async ( root, args, ctx, info ) => {
    const inputs = args.inputs;
    const {request} = ctx;
    
    let isGuardian = 0;
    
    if ( inputs.role === 'GUARDIAN' && !inputs.gender ) {
      throw new RequestError(request.t('Guardian gender missing'), 'PROCESS_FAILED');
    } else {
      isGuardian = 1;
    }
    
    const isInvited = await GuardianInvitation.emailExists(inputs.email);
    
    // Load signup utilities
    const SignupUtils = require('./utils/sign-up')({fastify, ctx, inputs});
    
    // Run inputs validation
    await SignupUtils.runValidations();
    
    /** @type {import('sequelize').Model&User#} */
    const model = User.build();
    await model.loadDefaults();
    
    if ( isInvited || inputs.role === User.ROLE_STUDENT ) {
      model.set({
        isActive: 1,
        isEmailVerified: 1,
      });
      model.removeJsonPath('activation.pending');
      model.removeJsonPath('activation.verifyCode');
      model.removeJsonPath('activation.expiredAt');
      model.setJsonValue('activation.completedAt', DateTime.timestamp());
    }
    
    if ( isGuardian ) {
      model.setJsonValue('guardian.gender', inputs.gender);
    }
    
    /** @type {string} */
    const fullName =  inputs.firstName && inputs.lastName
      ? `${inputs.firstName} ${inputs.lastName}`
      : 'Student Account';
  
    model.set({
      role: User.roleToAccountType(inputs.role),
      fullName,
      username: inputs.username,
      email: inputs.email,
      countryCode: inputs.country,
    });
    
    if ( inputs.role === User.ROLE_STUDENT ) {
      model.set({email: `${inputs.username}@fakemail.com`});
      
      model.setJsonValue('flags.realEmail', false);
      model.setJsonValue('flags.realName', false);
    }
    
    let [expiryInHours, verifyCode, expiredAt] = [null, null, null];

    //<editor-fold desc="Account activation related">
    if ( !isInvited || inputs.role !== User.ROLE_STUDENT ) {
      /** @type {number} */
      expiryInHours = Number(process.env.USER_SIGNUP_CODE_EXPIRY || 72) || 72;
      
      /** @type {string} */
      verifyCode = verificationCode();
      
      /** @type {string} */
      expiredAt = moment()
        .add(expiryInHours, 'hours')
        .utc().format('YYYY-MM-DD HH:mm:ss');
      
      model.setJsonValue('activation', {
        requestedAt: DateTime.timestamp(),
        expiredAt,
        verifyCode,
      });
    }
    //</editor-fold>
    
    //<editor-fold desc="Auth related">
    model.setPassword(inputs.password);
    model.generateAuthKey();
    //</editor-fold>
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await ctx.app.db.sequelize.transaction();
    
    try {
      // Register user
      await model.save({transaction});
      
      if ( !isInvited || inputs.role !== User.ROLE_STUDENT ) { // Register school or request school access
        await registerSchoolOrRequestAccess({inputs, model, transaction});

        await Mailer.getInstance().sendEmailTemplate('user_email_verification_code', [{
          name: model.get('fullName'), email: model.get('email'),
        }], {
          language: model.get('language'),
          variables: {
            firstname: model.getFirstName(),
            expiry: `${expiryInHours} hours`,
            code: verifyCode,
          },
        });
      }
      
      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process signup request'), 'PROCESS_FAILED');
    }
  };
};
