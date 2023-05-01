/** Utils */
const RequestError = require('./../../../components/RequestError');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {Classroom, Student, Diagnose, ClassStudent} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Update student
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER])` directive
     */
    Mutation.updateStudent = async ( root, args, ctx, info ) => {
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        console.log(inputs);

        let countDiagnoses = await Diagnose.count({
            where: {
                id: inputs.diagnoses,
                isActive: true,
            },
        });

        if ( countDiagnoses !==  inputs.diagnoses.length) {
            throw new RequestError(request.t('Diagnoses ID not found'), 'DIAGNOSES_NOT_FOUND');
        }

        const model = await Student.findOne({
            where: {
                id: inputs.id,
            },
        });

        if ( model === null ) {
            throw new RequestError(request.t('Student not found'), 'NOT_FOUND');
        }

        model.set({
            fullName: inputs.fullName,
            dob: inputs.dob,
            diagnoses: inputs.diagnoses
        });

        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});

            // await addStudentClass(model.get('id'), inputs.classId, transaction, request)

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to update student'), 'PROCESS_FAILED');
        }
    };

    /**
     * @async
     * @public
     * @static
     * Add student class
     * @param studentId - Student ID
     * @param classId - Class ID
     * @param transaction - Sequelize Transaction
     */
    const addStudentClass = async (studentId, classId, transaction, request) => {
        const schoolId = await Classroom.getSchoolID(classId);

        /** @type {import('sequelize').Model&ClassStudent#} */
        const model = ClassStudent.build();
        await model.loadDefaults();

        model.set({
            studentId,
            classId,
            schoolId,
        })
        try {
            await model.save({transaction});

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to update student class'), 'PROCESS_FAILED');
        }
    }
};
