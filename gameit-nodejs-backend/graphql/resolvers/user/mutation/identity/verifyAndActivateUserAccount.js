const moment = require('moment-timezone');

// Data utils
const DateTime = require('./../../../../../utils/data/data-time');

// Utils
const RequestError = require('./../../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation}, fastify ) => {
  const Mailer = require('../../../../../utils/mailer')(fastify);
  const {User} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Verify and activate pending user account
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<void>}
   * @see Uses `@guest` directive
   */
  Mutation.verifyAndActivateUserAccount = async ( root, args, ctx, info ) => {
    /**
     * @type {Object}
     * @property {string} username - Username
     * @property {string} code - Code
     */
    const inputs = args.inputs;
    const { request } = ctx;

    /** @type {import('sequelize').Model&User#} */
    const model = await User.findByEmailOrUsername(inputs.username);

    //<editor-fold desc="Basic validations">
    if ( model === null ) {
      throw new RequestError (request.t('Unknown username or email address'), 'NOT_FOUND', {
        username: 'Username not found',
      });
    }

    if ( !model.getJsonValue('activation.pending', false) ) {
      throw new RequestError (request.t('This account is already verified'), 'ACCOUNT_VERIFIED', {
        username: 'This account is already verified',
      });
    }

    if ( model.getJsonValue('activation.verifyCode') !== inputs.code ) {
      const msg = 'Invalid verification code';
      /** @type {string} */
      throw new RequestError(request.t(msg), 'BAD_CODE', {code: msg});
    }

    /** @type {string} */
    const expiredAt = model.getJsonValue('activation.expiredAt');

    //<editor-fold desc="Code expired">
    if ( moment().utc().isAfter(expiredAt) ) {
      const msg = 'Verification code has been expired';
      /** @type {string} */
      throw new RequestError(request.t(msg), 'CODE_EXPIRED', {code: msg});
    }
    //</editor-fold>

    model.removeJsonPath('activation.pending');
    model.removeJsonPath('activation.verifyCode');
    model.removeJsonPath('activation.expiredAt');
    model.setJsonValue('activation.completedAt', DateTime.timestamp());
    //</editor-fold>

    // Activate account for auth
    model.set({
      isActive: 1,
      isEmailVerified: 1,
    });

    //<editor-fold desc="Auth related">
    model.generateAuthKey();
    //</editor-fold>

    /** @type {import('sequelize').Transaction} */
    const transaction = await ctx.app.db.sequelize.transaction();

    try {
      // Reflect changes
      await model.save({transaction});

      // Send verification email
      await Mailer.getInstance().sendEmailTemplate('user_signup_success', [{
        name: model.get('fullName'), email: model.get('email'),
      }], {
        language: model.get('language'),
        variables: {
          firstname: model.get('fullName'),
          username: model.get('username'),
        }
      });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process verification request'), 'PROCESS_FAILED');
    }
  };
};
