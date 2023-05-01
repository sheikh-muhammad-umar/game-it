const graphFindOpts = require('./graphql-find-options');

/**
 * @public
 * @async
 * @static
 * Fetch pager records
 * @param {Object} Model - Sequelize model
 * @param {Object} params - Required params
 * @param {Object} params.pager
 * @param {Object} params.whereOptions
 * @param {number} params.limit
 * @param {Object} params.response
 * @param {Object} params.sortOrder
 * @param {Object} params.info
 * @return {Promise<Object[]>}
 */
async function recordsFetcher ( Model, params ) {
  const { pager, whereOptions, limit, response, sortOrder, info, include = [] } = params;
  
  try {
    //<editor-fold desc="Cursor Pagination">
    if ( pager.isCursor() ) {
      const { totalCount, edges, pageInfo } = await Model.cursorPaginate({
        where: whereOptions,
        before: pager.before,
        after: pager.after,
        order: sortOrder,
        desc: graphFindOpts.isFirstOrderDesc(sortOrder),
        limit,
        raw: true,
        paranoid: false,
        include,
      });
      
      response.pageInfo.cursors = pageInfo;
      response.totalCount = totalCount;
      return edges.map(row => row.node);
    }
    //</editor-fold>
    
    //<editor-fold desc="Number Pagination">
    if ( pager.isNumber() ) {
      const {pager: pageData, rows, total} = await Model.numberPagination({
        where: whereOptions,
        order: sortOrder,
        raw: true,
        include,
      }, {
        current: pager.page,
        perPage: limit,
      });
      
      response.pageInfo.pager = pageData;
      response.totalCount = total;
      return rows;
    }
    //</editor-fold>
    
  } catch ( e ) { throw e; }
}

module.exports = {
  recordsFetcher,
}
