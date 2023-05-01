const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const {defaultFieldResolver} = require('graphql');

const DIRECTIVE_NAME = 'auth';

module.exports = schema => mapSchema(schema, {
  [MapperKind.MUTATION_ROOT_FIELD]: config => {
    const directive = getDirective(schema, config, DIRECTIVE_NAME);
    
    if ( !directive ) {
      return undefined;
    }
  
    const {resolve = defaultFieldResolver} = config;
    
    config.resolve = async ( source, args, context, info ) => {
      //console.log({directive, source, args, context, info});
      //const user = getUserFn(context.headers.authToken)
      //if (!user.hasRole(requires)) {
      //throw new Error('not authorized');
      //}
      return await resolve(source, args, context, info);
    };
    return config;
  },
});
