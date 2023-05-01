/** Utils */
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {Classroom} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Update classroom
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER])` directive
     */
    Mutation.updateClassroom = async (root, args, ctx, info) => {
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        /** @type {import('sequelize').Model&Classroom#} */
        const model = await Classroom.findOne({
            where: {
                id: inputs.id,
                ownerId: userId
            },
        });

        if ( model === null ) {
            throw new RequestError(request.t('Classroom not found'), 'NOT_FOUND');
        }

        model.set({
            name: inputs.name,
            grade: inputs.grade,
        });

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to update classroom'), 'PROCESS_FAILED');
        }
    };
};
