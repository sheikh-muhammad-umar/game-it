/** Utils */
const RequestError = require('./../../../components/RequestError');
const Country = require('./../../../../utils/data/country');
const Language = require('./../../../../utils/data/language');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {User} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Update user
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER])` directive
     */
    Mutation.updateUserProfile = async (root, args, ctx, info) => {
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        if ( !Country.isValidCode(inputs.country) ) {
            throw new RequestError (request.t('Country does not exist'), 'BAD_COUNTRY', { country: 'Bad country name'});
        }

        if ( !Language.languageExists(inputs.language) ) {
            throw new RequestError (request.t('Language does not exist'), 'BAD_Language', { country: 'Bad language'});
        }
          
        /** @type {import('sequelize').Model&User#} */
        const model = await User.findOne({
            where: {
                id: userId
            },
        });

        if ( model === null ) {
            throw new RequestError(request.t('User not found'), 'NOT_FOUND');
        }

        model.set({
            fullName: inputs.name,
            countryCode : inputs.country,
            language : inputs.language,
            timezone : inputs.timezone,
        });

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to update user'), 'PROCESS_FAILED');
        }
    };
};
