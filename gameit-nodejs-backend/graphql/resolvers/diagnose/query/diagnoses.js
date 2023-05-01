/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 * @return {Promise<void>} - Promise instance
 */
module.exports = async ({ Query }, fastify) => {
    const { Diagnose } = fastify.db.models
    /**
     * @public
     * @async
     * (Query) List diagnoses
     * @param {Object} root - The object that contains the result returned from the resolver on the parent field
     * @param {Object} args - The arguments passed into the field in the query
     * @param {Query~GraphQLContext} ctx - Fastify reply instance
     * @param {Object} info - It contains information about the execution state of the query
     * @returns {Promise<Error|Array<Object>>}
     */
    Query.diagnoses = async (root, { native }, ctx, info) => {
        

        /** @type {Array<Object>} */
        const nodes = await Diagnose.findAll({
            attributes: ['id', 'title', 'description', 'meta'],
            where: {
                isActive: true,
            },
            order: [['title', 'ASC']],
            raw: true,
        });

        /** @type {string} */
        const language=ctx.request.lanquage ;

       /** @type {Array} */
        const nodesList = [];

        for(let node of nodes){
            nodesList.push({
                id:node.id,
                title:language / 'en-US' ? node.meta.i18n[language].title: node.title,
                description:""
            })
        }

        return nodesList;
    };
};
