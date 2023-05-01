/**
 * Fastify Apollo server plugin
 */

const fp = require('fastify-plugin');
const {ApolloServer} = require('apollo-server-fastify');
const {validate, specifiedRules} = require('graphql');
const costAnalysis = require('graphql-cost-analysis').default;
const op = require('object-path');

/** Custom modules modules */
const SchemaCompiler = require('./../lib/schema-compiler');
const RequestError = require('./../../../../graphql/components/RequestError');
const isDev = process.env.NODE_ENV !== 'production';

/**
 * @public
 * Plugin handler
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Additional options
 * @param {function(): void} next - Function to continue fastify lifecycle
 * @returns {Promise<void>} - Promise instance
 */
module.exports = fp(async (fastify, opts, next) => {
	/** @type {Object} */
	const schema = SchemaCompiler(fastify, opts);
	
	const server = new ApolloServer({
		schema,
		cacheControl: {
			calculateHttpHeaders: true,
			defaultMaxAge: 60,
			stripFormattedExtensions: true,
		},
		context: async ctx => {
			ctx.app = fastify;
			return ctx;
		},
		formatError ( error ) {
			const code = op.get(error, 'originalError.originalError.code')
				|| op.get(error, 'originalError.code')
				|| op.get(error, 'code');
			
			const exception = op.get(error, 'extensions.exception');
			delete error.extensions.exception;
			
			const customError = {
				message: null,
				code: null,
				state: {},
				...error, ...exception
			};
			
			if ( code === 'ERR_GRAPHQL_CONSTRAINT_VALIDATION' ) {
				const [type, message] = error.message.split("; ");
				const [, fieldName] = /^[^"]+"(?<field>[a-z][a-z\d]+)_/ig.exec(type);
				customError.message = message;
				customError.code = 'INSUFFICIENT_INPUT';
				customError.state =  {
					[fieldName]: message,
				};
			}
			
			return customError;
		},
		plugins: [{
			requestDidStart: () => ({
				didResolveOperation({ request, document }) {
					/**
					 * Validation rules
					 * @type {Array<Function>} */
					const validationRules = [
						...specifiedRules,
						costAnalysis({
							defaultCost: 0,
							variables: request.variables || {},
							maximumCost: 1000,
							createError: ( max, actual ) => new RequestError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`, 'QUERY_TOO_COMPLEX'),
							onComplete: complexity => isDev && console.log('Query Complexity:', complexity),
						}),
					];
					
					/** @type {ReadonlyArray<GraphQLError>} */
					const RequestErrors = validate(schema, document, validationRules);
					
					if ( RequestErrors.length > 0 ) {
						const [error = null] = RequestErrors;
						if ( error instanceof Error ) {
							throw error;
						}
					}
				},
				didEncounterErrors({context: {reply}}) {
					reply.code(400);
				},
			})
		}],
	});
	
	await server.start();
	
	fastify.register(server.createHandler({cors: false}));
	
	next();
}, {
	name: 'fastify-graphql-apollo',
});
