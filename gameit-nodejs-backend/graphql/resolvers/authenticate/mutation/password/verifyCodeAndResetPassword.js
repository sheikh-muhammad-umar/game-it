const moment = require('moment');

// Utils
const RequestError = require('./../../../../components/RequestError');

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
   * (Mutation) Verify code and reset account password
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|boolean>}
   * @see Uses `@guest` directive
   */
  Mutation.verifyCodeAndResetPassword = async ( root, args, ctx, info ) => {
    /** @type {{username: string, password: string, code: string}} */
    const inputs = args.inputs;
    const {request} = ctx;
    
    /** @type {import('sequelize').Model<User>&User#} */
    const model = await User.findByEmailOrUsername(inputs.username);
    
    //<editor-fold desc="Error: Unknown email address.">
    if ( model === null ) {
      const msg = 'Username or email address not found';
      /** @type {string} */
      throw new RequestError(request.t(msg), 'NOT_FOUND', {username: msg});
    }
    //</editor-fold>
    
    //<editor-fold desc="Invalid code">
    if ( model.getJsonValue('resetPassword.verifyCode') !== inputs.code ) {
      const msg = 'Invalid verification code';
      /** @type {string} */
      throw new RequestError(request.t(msg), 'CODE_INVALID', {code: msg});
    }
    //</editor-fold>
    
    /** @type {string} */
    const expiredAt = model.getJsonValue('resetPassword.expiredAt');
    
    //<editor-fold desc="Code expired">
    if ( moment().utc().isAfter(expiredAt) ) {
      const msg = 'Verification code has expired';
      /** @type {string} */
      throw new RequestError(request.t(msg), 'CODE_EXPIRED', {code: msg});
    }
    //</editor-fold>
    
    model.setPassword(inputs.password);
    model.generateAuthKey();
    
    /** @type {import('sequelize').Transaction} */
    const transaction = await fastify.db.sequelize.transaction();
    
    try {
      // Save changes to DB
      await model.save({transaction});
      
      // Send notification email
      await Mailer.getInstance().sendEmailTemplate('password_changed', [{
        name: model.get('fullName'),
        email: model.email,
      }], {
        language: model.get('language'),
        variables: {
          firstname: model.get('fullName'),
        },
      });
      
      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process reset password request'), 'PROCESS_FAILED');
    }
  };
};
