/**
 * GraphQL schema compiler
 */

const {loadTypedefsSync} = require('@graphql-tools/load');
const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')

// Utils
const Path = require('./../../../../utils/core/path');
const attachDirectivesToSchema = require('./attach-directives-to-schema');

/**
 * Schema file absolute path
 * @type {string} */
const SCHEMA_PATH = Path.normalize(`${__dirname}/../../../../graphql/schema/**/*.graphql`);

/**
 * Make schema
 * @param {FastifyInstance|FastifyServer} fastify - Fastify instance
 * @param {Object} opts - Additional options
 */
module.exports = ( fastify, opts ) => {
	/**
	 * Custom schema directives
	 * @type {Object} */
	//const schemaDirectives = require('./schema-directives');
	
	/**
	 * Combined schema
	 * @type {string} */
	const sources = loadTypedefsSync(SCHEMA_PATH, {loaders: [new GraphQLFileLoader()]});
	const typeDefs = sources.map(source => source.document);
	
	/** @type {Object} */
	const resolvers = require(`./../../../../graphql/resolvers/definitions`)(fastify, opts);
	
	let schema = makeExecutableSchema({
		typeDefs: [constraintDirectiveTypeDefs, typeDefs], resolvers,
	});
	
	schema = attachDirectivesToSchema(schema);
	
	return constraintDirective()(schema);
};
