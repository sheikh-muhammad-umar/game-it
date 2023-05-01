/** Utils */
const RequestError = require('./../../../components/RequestError');
const {createUUID} = require('./../../../../helpers/crypto');


/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({Mutation}, fastify) => {
    const {StudentGame} = fastify.db.models;

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
    Mutation.assignGameToStudent = async ( root, args, ctx, info ) => {
        const inputs = args.inputs;
        const { request } = ctx;
        const userId = fastify.user.id;


        if ( await StudentGame.gameExists(inputs.studentId, inputs.gameId) ) {
            throw new RequestError(request.t('Game already assigned'), 'GAME_ALREADY_ASSIGNED');
        }

        /** @type {import('sequelize').Model&Student#} */
        const model = StudentGame.build();
        await model.loadDefaults();

        console.log('userId:', userId)

        model.set({
            userId,
            studentId: inputs.studentId,
            gameId: inputs.gameId,
            sessionKey: createUUID(),
            instructions: inputs.instructions
        });


        /** @type {import('sequelize').Transaction} */
        const transaction = await ctx.app.db.sequelize.transaction();

        try {
            await model.save({transaction});

            await transaction.commit();

        } catch (e) {
            await transaction.rollback();
            console.log('Query error:', e);
            throw new RequestError(request.t('Unable to assign game to student'), 'PROCESS_FAILED');
        }
    };
};
