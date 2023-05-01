const moment = require('moment-timezone');

// Utils
const RequestError = require('./../../../../components/RequestError');
const {verificationCode} = require('./../../../../../utils/data/randomizer');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation, Subscription}, fastify ) => {
  const Mailer = require('../../../../../utils/mailer')(fastify);
  const {User} = fastify.db.models;

  /**
   * @public
   * @async
   * (Mutation) Send a reset password request via email
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|boolean>}
   * @see Uses `@guest` directive
   */
  Mutation.resetPasswordRequest = async ( root, args, ctx, info ) => {
    const {request} = ctx;

    const transaction = await ctx.app.db.sequelize.transaction();

    /** @type {import('sequelize').Model&User#} */
    const model = await User.findByEmailOrUsername(args.inputs.username, {
      where: {
        deletedAt: null,
        isActive: true,
      }
    });

    if ( model === null ) {
      throw new RequestError(
        request.t('Unknown username or email address'), 'NOT_FOUND', {
          username: 'Username does not exist',
        }
      );
    }

    /** @type {string} */
    const verifyCode = verificationCode();

    /** @type {string} */
    const expiryInHours = Number(process.env.USER_RESET_PASSWORD_CODE_EXPIRY || 3) || 3;
    /** @type {string} */
    const expiredAt = moment()
      .add(expiryInHours, 'hours')
      .utc().format('YYYY-MM-DD HH:mm:ss');

    try {
      // Invalidate token
      model.generateAuthKey();
      model.setJsonValue('resetPassword', {
        verifyCode,
        sentAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        expiredAt,
      });

      // Reflect changes
      await model.save();

      // Send verification email
      await Mailer.getInstance().sendEmailTemplate('user_reset_password_request_code', [{
        name: model.get('fullName'), email: model.get('email'),
      }], {
        language: model.get('language'),
        variables: {
          firstname: model.getFirstName(),
          expiry: `${expiryInHours} hours`,
          code: verifyCode,
        },
      });

      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(
        request.t('Unable to send reset password request'), 'PROCESS_FAILED'
      );
    }
  };
};
