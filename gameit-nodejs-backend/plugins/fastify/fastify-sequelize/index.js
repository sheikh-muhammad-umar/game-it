/**
 * Fastify sequelize ORM plugin
 */

/** Native/Installed modules */
const fp = require('fastify-plugin');

/**
 * Register a main function
 * @param {import('fastify').FastifyInstance&FastifyServer} fastify fastify instance
 * @param {{string: any}} opts Plugin options
 * @param {function(): function} next Next function
 */
async function main ( fastify, opts, next ) {
	if ( process.env.DATABASE_ENABLED !== 'true' ) {
		next();
		return;
	}
	
	/**
	 * Fastify sequelize
	 * @class FastifySequelize
	 * @extends {sequelize~Sequelize}
	 * @property {import('sequelize').Sequelize} sequelize - Sequelize instance
	 * @property {SequelizeModelsDefs} models - Sequelize models
	 */
	
	/** @type {import('sequelize').Sequelize} */
	const sequelize = require('./../../../sequelize/instance');
	const models = require('./../../../sequelize/init-models')(fastify, sequelize);
	
	fastify.decorate('db', {
		sequelize,
		models,
	});
	
	fastify.addHook('onClose', async ( instance, done ) => {
		await sequelize.close();
		done();
	});
	
	next();
}

// Export plugin to module
module.exports = fp(main, {
	name: 'fastify-sequelize'
});
