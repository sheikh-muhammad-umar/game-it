/**
 * Fastify Stats controller
 */
/**
 * Stats controller
 * @description fastify routes
 * @param {import('fastify').FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {Object} opts - Plugin options
 * @param {function(): void} next - Next function
 */
 module.exports = async ( fastify, opts, next ) => {
    const {User, Student} = fastify.db.models;
    fastify
      /** Homepage */
      .get('/api/dashboard/stats', async () => {

        /** @type {number} */
        const totalStudents = await Student.count({});

        /** @type {number} */
        const totalTeachers = await User.count({
          where: {
            role: User.TYPE_TEACHER,
            isActive: 1
          }
        });

        /** @type {number} */
          const totalGuardians = await User.count({
            where: {
              role: User.TYPE_GUARDIAN,
              isActive: 1
            }
          });
        
        /** @type {number} */
          const totalSchoolAdmin = await User.count({
            where: {
              role: User.TYPE_SCHOOL_ADMIN,
              isActive: 1
            }
          });

       
        return {
          totalStudents,
          totalTeachers,
          totalGuardians,
          totalSchoolAdmin
       
        };
      });
    next();
  };