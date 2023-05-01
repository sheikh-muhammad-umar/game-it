const op = require('object-path');
const {recursive} = require('merge');
const Ajv = require('ajv');
const AjvI18N = require('ajv-i18n');
const AjvKeywords = require('ajv-keywords');
const AjvAddFormats = require('ajv-formats');
const AjvErrors = require('ajv-errors');

/**
 * @public
 * @namespace AjvHelper
 * Create Ajv instance<br>
 * Special replaceable variables in `errorMessage`:
 * <ul>
 *   <li><b>'$t$'</b>: Replace by title's property value</li>
 *   <li><b>'$vv$'</b>: Replace by validation rule's value</li>
 * </ul>
 * @param {Object} options={} - Additional options
 * @param {import('ajv').Options} options.ajv={} - Ajv options
 * @param {string|Array<*>|*} options.ajvKeywords=null - Ajv keywords options
 * @return {import('ajv/lib/jtd')} - Validate function
 * @example
 * // Basic example
 * const validate = ajvInstance()
 * .addKeyword({
 *   keyword: 'minLengthOpt',
 *   type: 'number',
 *   validate: ( schema, data ) =>
 *     !data ? true : !(String(data).length < schema),
 * })
 * .compile({
 *     title: 'Caption',
 *     type: 'string',
 *     minLengthOpt: 5,
 *     maxLength: 30,
 *     errorMessage: {
 *       minLengthOpt: request.t(`$t$ length should be greater than $vv$`, 5),
 *     }
 * });
 * if ( !validate(data) ) {
 *   const {message} = ajvParseError(validate, request);
 *   return new Error(message);
 * }
 */
function ajvInstance ( options = {} ) {
  const ajvOptions = recursive(true, {
    verbose: true,
    allErrors: true,
    $data: true,
  }, options.ajv || {});
  
  const ajv = new Ajv(ajvOptions);
  
  AjvKeywords(ajv, options.ajvKeywords || null);
  AjvAddFormats(ajv);
  AjvErrors(ajv, {single: true});
  
  /** @type {Object} */
  return ajv;
}

/**
 * @public
 * @namespace AjvHelper
 * Get i18n/formatted error messages from `ajv` validation errors<br>
 * Special replaceable variables:
 * <ul>
 *   <li><b>'$t$'</b>: Replace by title's property value</li>
 *   <li><b>'$vv$'</b>: Replace by validation rule's value</li>
 * </ul>
 * @param {validate} validate - Validate function
 * @param {FastifyRequest|FastifyRequest} request - Fastify request instance
 * @returns {{message: string, key: string}|null} Error message / Nothing
 * @example
 * // Simple error
 * if ( !validate(data) ) {
 *   const {message} = ajvParseError(validate, request);
 *   return new Error(message);
 * }
 *
 * @example
 * // Graphql based error
 * if ( !validate(data) ) {
 *   const {message, key} = ajvParseError(err, request);
 *   return new ValidationError(message, 'BAD_INPUT', {[key]: message});
 * }
 */
function ajvParseError ( validate, request ) {
  if ( !validate.errors.length ) {
    return null;
  }
  
  //<editor-fold desc="i18n messages">
  const [lng] = request.language.split('-');
  
  if ( AjvI18N.hasOwnProperty(lng) ) {
    AjvI18N[lng](validate.errors[0]);
  }
  //</editor-fold>
  
  const {keyword, instancePath, message, parentSchema} = op.get(validate, 'errors.0');
  
  /** @type {string} */
  let errorMessage = op.get(
    parentSchema,
    `errorMessage.${keyword}`,
    `${parentSchema.title} ${message}`
  );
  
  errorMessage = errorMessage.replace(/\$t\$/g, parentSchema.title)
    .replace(/\$vv\$/g, parentSchema[keyword] || '');
  
  if ( errorMessage.match(new RegExp(`${parentSchema.title} `, 'g')).length > 1 ) {
    errorMessage = errorMessage.replace(new RegExp(`${parentSchema.title} `, ''), '');
  }
  
  return {
    message: errorMessage,
    key: String(instancePath).replace(/^\//, ''),
  }
}

module.exports = {
  ajvInstance,
  ajvParseError
};
