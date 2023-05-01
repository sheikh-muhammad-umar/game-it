/** Utils */
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {Classroom, TeacherSchool, School} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Create classroom
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER])` directive
     */
    Mutation.createClassroom = async ( root, args, ctx, info ) => {
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        if ( !(await School.idExists(inputs.schoolId, { where: { isActive: true } } )) ) {
            throw new RequestError(request.t('School not found'), 'SCHOOL_NOT_FOUND');
        }

        if ( !(await TeacherSchool.isSchoolOf(inputs.schoolId, userId)) ) {
            throw new RequestError(request.t('You dont have permission to access this school'), 'PERMISSION_DENIED');
        }

        /** @type {import('sequelize').Model&Classroom#} */
        const model = Classroom.build();
        await model.loadDefaults();

        model.set({
            ownerId: userId,
            name: inputs.name,
            grade: inputs.grade,
            schoolId: inputs.schoolId,
        });

        /** Generate unique class code */
        await model.generateClassCode();

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});
            await transaction.commit();

            const record = await Classroom.toGraphObject(model);
            record.isOwner = true;
            return record;
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to create classroom'), 'PROCESS_FAILED');
        }
    };
};
