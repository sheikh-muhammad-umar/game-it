const op = require('object-path');

// Utils
const ValidationError = require('./../../graphql/components/RequestError');

/**
 * @public
 * @static
 * Return filtered metadata by given roots
 * @param {objectPath~Path[]} paths - List of root paths
 * @param {Object} record - The record row
 * @param {Object} [options={}] - Additional options
 * @param {string} options.metaField='meta' - Meta field name
 * @param {boolean} options.throwError=false - Throw error on unknown field name
 * @param {FastifyRequest~FastifyRequest} options.request=null - Fastify request instance
 * @return {Object} - Finalized data
 * @throws {ValidationError}
 */
function toGraphQLFilterMetaData ( paths, record, options = {} ) {
  options = {
    metaField: 'meta',
    throwError: false,
    request: null,
    ...options,
  }
  
  /** @type {Object} */
  let metaData = {};
  
  if ( !Array.isArray(paths)
    || !paths.length
    || !record.hasOwnProperty(options.metaField) ) {
    return metaData;
  }
  
  /** @type {Object} */
  const rowMeta = op.get(record, options.metaField);
  
  for ( let root of paths ) {
    if ( !op.has(rowMeta, root) ) {
      if ( options.throwError ) {
        throw new ValidationError(options.request.t(`Unknown meta field '{{name}}'`, {name: root}), 'UNKNOWN_META_PATH');
      }
      continue;
    }
    
    op.set(metaData, root, op.get(rowMeta, root, null));
  }
  
  record.metaMapped = metaData;
  
  return record;
}

module.exports = {
  toGraphQLFilterMetaData,
};
