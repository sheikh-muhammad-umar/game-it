/** Utils */
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {Student} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Register Student
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     */
    Mutation.registerStudent = async ( root, args, ctx, info ) => {
        const inputs = args.inputs;
        const { request } = ctx;

        if ( await Student.usernameExists(inputs.username) ) {
            throw new RequestError(request.t('Username already exist'), 'USERNAME_ALREADY_EXIST');
        }

        if ( inputs.email && await Student.emailExists(inputs.email) ) {
            throw new RequestError(request.t('Email already exist'), 'EMAIL_ALREADY_EXIST');
        }

        /** @type {import('sequelize').Model&Student#} */
        const model = Student.build();
        await model.loadDefaults();

        const fullName = inputs.fullname? inputs.fullname : inputs.username;

        model.set({
            fullName,
            grade: 0,
            dob: Date.now(),
        });

        model.setJsonValue('password', inputs.password);
        model.setJsonValue('username', inputs.username);
        inputs.email && model.setJsonValue('email', inputs.email);

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});

            await transaction.commit();

            const record = await Student.toAssociateGraphObject(model);
            return record;
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to register student'), 'PROCESS_FAILED');
        }
    };
};
