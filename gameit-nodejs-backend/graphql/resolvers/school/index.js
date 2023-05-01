
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
  defs.School = {};
  defs.MemberSchool = {};

  //<editor-fold desc="Mutation">
  require('./mutation/createSchool')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Query">
  require('./query/listSchools')(defs, fastify);
  require('./query/listMemberSchools')(defs, fastify);
  require('./query/listTeacherSchools')(defs, fastify);
  //</editor-fold>

  //<editor-fold desc="Types">
  require('./types/country')(defs, fastify);
  //</editor-fold>
};
