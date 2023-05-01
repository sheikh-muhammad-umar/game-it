/**
 * @package traits
 * Sequelize cursor pagination trait
 */

/** Native/Installed modules */
const withPagination = require('sequelize-cursor-pagination');

/**
 * Sequelize cursor pagination for sequelize model
 * @param {import('sequelize').Model} model - Sequelize model instance
 * @mixin CursorPaginationTrait
 */
module.exports = model => {
  /**
   * The paginated result
   * @typedef {object} CursorPaginationResult
   * @property {object[]} results - The results of the query
   * @property {object} cursors - Object containing the cursors' related data
   * @property {string} cursors.before, the first record in the result serialized
   * @property {string} cursors.after, the last record in the result serialized
   * @property {boolean} cursors.hasNext, true or false depending on whether there are records after the after cursor
   * @property {boolean} cursors.hasPrevious, true or false depending on whether there are records before the before cursor
   */
  
  /**
   * The `cursorPaginate` method has the following options:
   * @typedef {object} CursorPaginationOptions
   * @property {import('sequelize').WhereOptions} where - The query applied to findAll call
   * @property {import('sequelize').FindAttributeOptions} attributes=[] - The query applied to findAll and select only some attributes
   * @property {import('sequelize').IncludeOptions} include=[] - Applied to findAll for eager loading
   * @property {number} limit - Limit the number of records returned <b style="color:red">(required)</b>
   * @property {import('sequelize').FindOptions} order=[] - custom ordering attributes,
   * @property {boolean} desc=false - Whether to sort in descending order. The default value is false.
   * @property {string} before='' - The before cursor
   * @property {string} after='' - The after cursor
   * @property {string} paginationField='id' - The field to be used for the pagination. The default value is the primaryKeyField option value.
   * @property {boolean} raw=false - Whether the query will return Sequelize Models or raw data. The default is false.
   * @property {boolean} paranoid=false - Whether the query will return deleted models if the model is set to paranoid: true. The default is true.
   */
  
  /**
   * @public
   * @async
   * Cursor based pagination
   * @name CursorPaginationTrait.cursorPaginate
   * @param {CursorPaginationOptions} options - The paginate options
   * @returns {Promise<CursorPaginationResult>} Fetched results
   * @example
   * const results = Model.cursorPaginate({
   *   where: { value: { $gt: 2 } },
   *   limit: 10,
   * })
   */
  withPagination({
    methodName: 'cursorPaginate',
    primaryKeyField: 'id',
  })(model);
};
