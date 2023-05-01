// Utils
const RequestError = require('./../../../../components/RequestError');
const UserAuth = require('../../../../../helpers/fastify/auth/authenticate');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ( {Mutation, Subscription}, fastify ) => {
  const Mailer = require('../../../../../utils/mailer')(fastify);
  const {clearAuthCookie} = UserAuth(fastify);
  
  /**
   * @public
   * @async
   * (Mutation) Change auth user password
   * @param {Object} root - The object that contains the result returned from the resolver on the parent field
   * @param {Object} args - The arguments passed into the field in the query
   * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
   * @param {Object} info - It contains information about the execution state of the query
   * @returns {Promise<Error|boolean>}
   * @see Uses `@auth` directive
   */
  Mutation.changePassword = async ( root, {inputs}, ctx, info ) => {
    const {request, reply} = ctx;
    
    const {
      /** @type {import('sequelize').Model&User#} */
      identity,
    } = ctx.app.user;
    
    const transaction = await ctx.app.db.sequelize.transaction();
    
    if ( !identity.validatePassword(inputs.current) ) {
      throw new RequestError(request.t('Your current password is incorrect'), 'PASSWORD_INVALID', {
        current: 'Incorrect password',
      });
    }
    
    if ( inputs.current === inputs.newPassword ) {
      throw new RequestError(request.t('Your cannot use the same password'), 'PASSWORD_IDENTICAL', {
        newPassword: 'Password identical to current one',
      });
    }
    
    try {
      // Invalidate token
      identity.generateAuthKey();
      identity.setPassword(inputs.newPassword);
      
      // Reflect changes
      await identity.save();
      
      // Send email notification
      await Mailer.getInstance().sendEmailTemplate('password_changed', [{
        name: identity.get('fullName'), email: identity.get('email'),
      }], {
        language: identity.get('language'),
        variables: {
          firstname: identity.get('fullName'),
        },
      });
      
      clearAuthCookie(request, reply);
      await transaction.commit();
    } catch ( e ) {
      await transaction.rollback();
      console.log('Query error:', e);
      throw new RequestError(request.t('Unable to process change password request'), 'PROCESS_FAILED');
    }
  };
};
