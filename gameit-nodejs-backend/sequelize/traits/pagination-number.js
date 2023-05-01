/**
 * Sequelize number pagination trait
 */

const pagination = require('pagination');
const merge = require('merge');

/**
 * Sequelize number pagination for sequelize model
 * @param {import('sequelize').Model} model Sequelize model instance
 * @mixin NumberPaginationTrait
 */
module.exports = model => {
  /**
   * The paginate `pager` has following properties
   * @typedef {Object} NumberPaginationResultPager
   * @property {Number} pageCount - Total pages count
   * @property {Number|null} current - Current page
   * @property {Number|null} previous - Previous page
   * @property {Number|null} next - Next page
   * @property {Number|null} first - First page
   * @property {Number|null} last - Last page
   */
  
  /**
   * The `numberPagination` method returns the following properties
   * @typedef {Object} NumberPaginationResult
   * @property {Number} total - Total counts
   * @property {Object[]} rows - The records
   * @property {NumberPaginationResultPager} pager - Pager info
   */
  
  /**
   * @static
   * @public
   * @async
   * @name NumberPaginationTrait.numberPagination
   * Number Pagination
   * @param {import('sequelize').FindOptions} findOptions - Sequelize options
   * @param {Object} options={} - Additional options, see below:
   * @param {number} options.current=1 - Current page
   * @param {number} options.perPage=20 - Limit of rows per page
   * @return {Promise<NumberPaginationResult>} Output data
   * @example
   * const { rows, total, pager } = MyModel.numberPagination({ page: 1, paginate: 25 })
   */
  model.numberPagination = async ( findOptions = {}, options = {} ) => {
    options = merge.recursive(true, {
      current: 1,
      perPage: 20,
    }, options);
    
    // Fix `current` value
    if ( isNaN(options.current) || options.current < 1 ) {
      options.current = 1;
    }
    
    // Fix `perPage` value
    if ( isNaN(options.perPage) || options.perPage < 1 ) {
      options.perPage = 20;
    }
    
    /** @type {sequelize.CountOptions} */
    let countFindOptions = {...findOptions};
    countFindOptions.attributes = [];
    
    /** @type {number} */
    let total = await model.count(countFindOptions);
    
    /** @type {Object} */
    const paginator = new pagination.SearchPaginator({
      current: options.current,
      rowsPerPage: options.perPage,
      totalResult: total,
    });
    
    /** @type {Object} */
    const pageData = paginator.getPaginationData();
    
    if ( options.current > pageData.pageCount ) {
      options.current = pageData.current;
    }
    
    /** @type {number} */
    const offset = Math.round(options.perPage * (options.current - 1));
    
    /** @type {Object[]} */
    const rows = await model.findAll({
      ...findOptions,
      limit: options.perPage,
      offset,
    });
    
    return {
      total,
      rows,
      pager: {
        pageCount: pageData.pageCount,
        current: pageData.current,
        previous: pageData.previous,
        next: pageData.next,
        first: pageData.first,
        last: pageData.last,
      }
    };
  };
};
