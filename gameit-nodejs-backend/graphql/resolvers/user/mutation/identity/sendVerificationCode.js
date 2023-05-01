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
  const {User} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Create a new user account
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<void>}
   * @see Uses `@guest` directive
   */
  Mutation.sendVerificationCode = async ( root, args, ctx, info ) => {
    /**
     * @type {Object}
     * @property {string} username - Username
     */
    const inputs = args.inputs;
    const { request } = ctx;

    /** @type {import('sequelize').Model&User#} */
    const model = await User.findByEmailOrUsername(inputs.username);

    //<editor-fold desc="Basic validations">
    if ( model === null ) {
      throw new RequestError (request.t('Unknown username or email address'), 'NOT_EXIST', {
        username: 'Username not found',
      });
    }

    if ( !model.getJsonValue('activation.pending', false) ) {
      throw new RequestError (request.t('This account is already verified'), 'ALREADY_VERIFIED', {
        username: 'This account is already verified',
      });
    }
    //</editor-fold>

    //<editor-fold desc="Account activation related">
    /** @type {number} */
    const expiryInHours = Number(process.env.USER_SIGNUP_CODE_EXPIRY || 72) || 72;

    /** @type {string} */
    const verifyCode = verificationCode();

    /** @type {string} */
    const expiredAt = moment()
      .add(expiryInHours, 'hours')
      .utc().format('YYYY-MM-DD HH:mm:ss');

    model.setJsonValue('activation', {
      requestedAt: DateTime.timestamp(),
      expiredAt,
      verifyCode,
    });
    //</editor-fold>

    //<editor-fold desc="Auth related">
    model.generateAuthKey();
    //</editor-fold>

    /** @type {import('sequelize').Transaction} */
    const transaction = await ctx.app.db.sequelize.transaction();

    try {
      // Reflect changes
      await model.save();

      // Send verification email
      await Mailer.getInstance().sendEmailTemplate('user_email_verification_code', [{
        name: model.get('fullName'), email: model.get('email'),
      }], {
        language: model.get('language'),
        variables: {
          firstname: model.getFirstName(),
          expiry: `${expiryInHours} hours`,
          code: verifyCode,
        }
      });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process signup request'), 'PROCESS_FAILED');
    }
  };
};
