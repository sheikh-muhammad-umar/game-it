const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const {defaultFieldResolver} = require('graphql');

// Utils
const RequestError = require('./../../../graphql/components/RequestError');
const JWTUtilsStatic = require('./../../../helpers/fastify/auth/jwt-identity');

/**
 * Graphql Directive name
 * @type {string} */
const DIRECTIVE_NAME = 'auth';

/**
 * @type {{[string]: function(User): void}}
 */
const statusesResolvers = {
	ACTIVE (model) {
		const isActive = model.deletedAt === null
			&& model.isActive
			&& model.isEmailVerified;

		if ( !isActive ) {
			throw new RequestError (`Only active users can assess to part`, 'BAD_STATUS');
		}
	},
	EMAIL_VERIFIED (model) {
		if ( !model.get('isEmailVerified') ) {
			throw new RequestError (`Only verified users can assess to part`, 'BAD_STATUS');
		}
	},
	EMAIL_UNVERIFIED (model) {
		if ( model.get('isEmailVerified') ) {
			throw new RequestError (`Only unverified users can assess to part`, 'BAD_STATUS');
		}
	},
};

/**
 * @private
 * @static
 * Validates user authentication request
 */
const validateAuthRequest = async ( {source, args, context, info, directive}) => {
	const {app, request} = context;
	const {findIdentityByToken, getTokenFromAll} = JWTUtilsStatic(app);

	const token = String(getTokenFromAll(request) || '').trim();

	if ( !token ) {
		throw new RequestError (request.t(`No privileges to proceed`), 'UNAUTHORIZED');
	}

	const {model} = await findIdentityByToken(token, {req: request});

	const [{
		/** @type {Array<number>} */
		id = [],
		/** @type {Array<string>} */
		role = [],
		/** @type {Array<string>} */
		status: statuses = []
	}] = directive;

	//<editor-fold desc="Filter access by ID">
	if ( id.length && !id.includes(model.getId()) ) {
		throw new RequestError(request.t('Only specific users are allowed to access this part'), 'NOT_ALLOWED');
	}
	//</editor-fold>

	//<editor-fold desc="Filter access by ID">
	if ( role.length && !role.includes(model.toUserRole()) ) {
		throw new RequestError(request.t('Insufficient permissions'), 'BAD_ROLE');
	}
	//</editor-fold>

	//<editor-fold desc="Filter access by ID">
	if ( statuses.length ) {
		for ( const status of statuses ) {
			statusesResolvers.hasOwnProperty(status)
			&& statusesResolvers[status].call(null, model);
		}
	}
	//</editor-fold>

	return model;
}

/**
 * @private
 * @static
 * Get a fieldConfig.resolver
 * @return {function(): Promise<any>}
 */
const configResolver = ( {resolve, directive} ) => {
	return async ( source, args, context, info ) => {
		const model = await validateAuthRequest({source, args, context, info, directive});
		context.app.user.identity = model;
		context.app.user.isGuest = false;
		context.app.user.id = model.getId();

		return await resolve(source, args, context, info);
	}
};

/**
 * @private
 * @static
 * Get a Graphql schema kind resolver
 * @return {function(): Object}
 */
const kindResolver = schema => {
	return config => {
		const directive = getDirective(schema, config, DIRECTIVE_NAME);

		if ( !directive ) {
			return undefined;
		}

		const {resolve = defaultFieldResolver} = config;
		config.resolve = configResolver({resolve, directive});

		return config;
	};
}

module.exports = schema => mapSchema(schema, {
	[MapperKind.MUTATION_ROOT_FIELD]: kindResolver(schema),
	[MapperKind.QUERY_ROOT_FIELD]: kindResolver(schema),
});
