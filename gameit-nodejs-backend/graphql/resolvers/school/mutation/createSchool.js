/** Utils */
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {TeacherSchool, School} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Create School
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER, SCHOOL_ADMIN])` directive
     */
    Mutation.createSchool = async ( root, args, ctx, info ) => {
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        if ( await School.nameExists(inputs.name) ) {
            throw new RequestError(request.t('School already exist'), 'SCHOOL_ALREADY_EXIST');
        }

        /** @type {import('sequelize').Model&School#} */
        const model = School.build();
        await model.loadDefaults();

        model.set({
            ownerId: userId,
            name: inputs.name,
        });

        model.setJsonValue('city', inputs.city);
        model.setJsonValue('countryCode', inputs.country);

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});
            await transaction.commit();
            
            const record = await School.toGraphObject(model);
            record.isOwner = true;
            return record;
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to create school'), 'PROCESS_FAILED');
        }
    };
};
