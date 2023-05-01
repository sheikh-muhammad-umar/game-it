const glob = require('glob');

// Utils
const Path = require('./../../utils/core/path');

// Sub-definitions
const Query = require('./Query');
const Mutation = require('./Mutation');
//const Subscription = require('./Subscription');

const {
	NonPositiveIntResolver: NonPositiveInt,
	PositiveIntResolver: PositiveInt,
	NonNegativeIntResolver: NonNegativeInt,
	NegativeIntResolver: NegativeInt,
	NonPositiveFloatResolver: NonPositiveFloat,
	PositiveFloatResolver: PositiveFloat,
	NonNegativeFloatResolver: NonNegativeFloat,
	NegativeFloatResolver: NegativeFloat,
	EmailAddressResolver: EmailAddress,
	URLResolver: URL,
	JSONResolver: JSON,
	GraphQLDate: Date,
	GraphQLTime: Time,
	GraphQLDateTime: DateTime,
	GraphQLVoid: Void,
} = require('graphql-scalars');

/**
 * Graphql resolvers definitions
 * @typedef ResolversDefs
 * @type {Object}
 * @property {{string: function(Object, Object, Query~GraphQLContext, Object): Promise<any>|Error}} Query - Graphql query definitions
 * @property {{string: function(Object, Object, Mutation~GraphQLContext, Object): Promise<any>|Error}} Mutation - Graphql mutation definitions
 * @property {{string:{string: function(): *}}} Subscription - Graphql subscription definitions
 */

/**
 * Global Resolvers
 * @type {ResolversDefs}
 */
const Resolvers = {
	// == Custom Types == //
	
	// == Thirdparty custom Types == //
	JSON,
	Void,
	NonPositiveInt,
	PositiveInt,
	NonNegativeInt,
	NegativeInt,
	NonPositiveFloat,
	PositiveFloat,
	NonNegativeFloat,
	NegativeFloat,
	EmailAddress,
	URL,
	
	Date, Time, DateTime,

	User: {},
	
	// == Query == //
	Query,
	// == Mutation == //
	Mutation,
	// == Subscription == //
	//Subscription,
};

/** @type {string} */
const basePath = Path.normalize(__dirname);

module.exports = ( fastify, opts ) => {
	/** @type {Array<string>} */
	const files = glob.sync(`${basePath}/**/index.js`);
	
	for ( const file of files ) {
		require(Path.normalize(file))(Resolvers, fastify, opts);
	}
	
	return Resolvers;
};
