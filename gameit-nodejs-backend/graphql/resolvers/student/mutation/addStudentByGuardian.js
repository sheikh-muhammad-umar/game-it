/** Utils */
const RequestError = require('../../../components/RequestError');
const Country = require('./../../../../utils/data/country');

/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {Classroom, Student, School, Diagnose, ClassStudent, TeacherStudents} = fastify.db.models;

    /**
     * @public
     * @async
     * (Mutation) Create a student
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Mutation~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     * @see Uses `@auth(role: [TEACHER])` directive
     */
    Mutation.addStudentByGuardian = async ( root, args, ctx, info ) => {
        /** @type {{gradeId: number, dob: Date, fullname: string, diagnoses: JSON, classId: number}} */
        const inputs = args.inputs;
        const userId = fastify.user.id;
        const { request } = ctx;

        if ( !Country.isValidCode(inputs.nationality) ) {
            throw new RequestError (request.t('Country does not exist'), 'BAD_COUNTRY', {
              country: 'Bad country name',
            });
          }

        let countDiagnoses = await Diagnose.count({
            where: {
                id: inputs.diagnoses,
                isActive: true,
            },
        });

        if ( countDiagnoses !==  inputs.diagnoses.length) {
            throw new RequestError(request.t('Diagnoses ID not found'), 'DIAGNOSES_NOT_FOUND');
        }

        /** @type {import('sequelize').Model&Student#} */
        const model = Student.build();
        await model.loadDefaults();

        model.set({
            fullName: inputs.fullName,
            dob: inputs.dob,
            grade: inputs.grade,
            diagnoses: inputs.diagnoses
        });

        model.setJsonValue('gender', inputs.gender);
        model.setJsonValue('city', inputs.city);
        model.setJsonValue('countryCode', inputs.nationality);
        model.setJsonValue('guardian.id', userId);

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
            throw new RequestError(request.t('Unable to create student'), 'PROCESS_FAILED');
        }
    };
};
