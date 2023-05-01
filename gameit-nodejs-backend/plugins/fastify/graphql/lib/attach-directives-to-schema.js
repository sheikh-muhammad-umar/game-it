/**
 * GraphQL custom directives' definition file
 */

const glob = require('glob');

// Utils
const Path = require('./../../../../utils/core/path');

/** @type {string} */
const BASE_PATH = Path.normalize(`${__dirname}/../../../../graphql/directives/enabled`);

module.exports = schema => {
	/** @type {Array<string>} */
	const directives = glob.sync(`${BASE_PATH}/**/*.js`);
	
	for ( const directive of directives ) {
		schema = require(Path.normalize(directive))(schema);
	}
	
	return schema;
};

