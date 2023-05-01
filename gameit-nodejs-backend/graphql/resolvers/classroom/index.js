/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = (defs, fastify) => {
  // Initialize type def
  defs.Classroom = {};

  //<editor-fold desc="Mutation">
  require('./mutation/createClassroom')(defs, fastify);
  require('./mutation/updateClassroom')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Query">
  require('./query/listClassrooms')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Types">
  require('./types/school')(defs, fastify);
  //</editor-fold>
};
