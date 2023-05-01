const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const {defaultFieldResolver} = require('graphql');

// Utils
const RequestError = require('./../../../graphql/components/RequestError');
const JWTUtilsStatic = require('./../../../helpers/fastify/auth/jwt-identity');

/**
 * Graphql Directive name
 * @type {string} */
const DIRECTIVE_NAME = 'guest';

const validateAuthRequest = async ( {context}) => {
	const {getTokenFromAll} = JWTUtilsStatic(context.app);

	const token = String(getTokenFromAll(context.request) || '').trim();

	if ( token ) {
		throw new RequestError(context.request.t('This can only access by non-authenticated users'), 'NOT_ALLOWED');
	}
}

module.exports = schema => mapSchema(schema, {
	[MapperKind.MUTATION_ROOT_FIELD]: config => {
		const directive = getDirective(schema, config, DIRECTIVE_NAME);

		if ( !directive ) {
			return undefined;
		}

		const {resolve = defaultFieldResolver} = config;

		config.resolve = async ( source, args, context, info ) => {
			await validateAuthRequest({source, args, context, info, directive});
			return await resolve(source, args, context, info);
		};
		return config;
	},
});
