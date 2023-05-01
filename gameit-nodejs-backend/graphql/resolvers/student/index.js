
/**
 * @param {ResolversDefs} defs - Resolvers definitions
 * @param {FastifyInstance&FastifyServer} fastify - Fastify instance
 */
module.exports = ( defs, fastify ) => {
	// Initialize type def
	defs.Student = {};

	//<editor-fold desc="Mutation">
	require('./mutation/addStudentByTeacher')(defs, fastify);
	require('./mutation/addStudentByGuardian')(defs, fastify);
	require('./mutation/updateStudent')(defs, fastify);
	require('./mutation/registerStudent')(defs, fastify);
	require('./mutation/assignGameToStudent')(defs, fastify);

	//</editor-fold>

	//<editor-fold desc="Query">
	require('./query/listStudents')(defs, fastify);
	//</editor-fold>

	//<editor-fold desc="Types">
	require('./types/guardian')(defs, fastify);
	require('./types/user')(defs, fastify);
	require('./types/school')(defs, fastify);
	require('./types/classroom')(defs, fastify);
	require('./types/guardianInvitation')(defs, fastify);
	//</editor-fold>
};
