/**
 * GraphQL findOption parser utility functions
 * @module graphql-find-options
 */

const R = require('ramda');
const objectPath = require('object-path');
const {recursive} = require('merge');
const Sequelize = require('sequelize');
const graphqlFields = require('graphql-fields');

// Utils
const {createHashJson} = require('./../crypto');

/**
 * @const
 * @readonly
 * @type {string}
 * @default NUMBER
 */
const PAGER_NUMBER = 'NUMBER';

/**
 * @const
 * @readonly
 * @type {string}
 * @default CURSOR
 */
const PAGER_CURSOR = 'CURSOR';

/**
 * @private
 * @readonly
 * Operators maps
 * @type {{[string]: string}}
 */
const seqOps = {
  and: 'and',
  or: 'or',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  ne: 'ne',
  eq: 'eq',
  not: 'not',
  between: 'between',
  notBetween: 'notBetween',
  in: 'in',
  any: 'any',
  notIn: 'notIn',
  like: 'like',
  notLike: 'notILike',
  iLike: 'iLike',
  notILike: 'notILike',
  contained: 'contained',
  contains: 'contains',
};

/**
 * @private
 * @readonly
 * Postgres allowed cast types for findOptions
 * @type {{[string]: string}}
 */
const postgresBasicTypes = {
  bool: 'BOOLEAN',
  
  int: 'INT',
  smallint: 'SMALLINT',
  float: 'FLOAT',
  real: 'REAL',
  numeric: 'NUMERIC',
  
  char: 'CHAR',
  varchar: 'VARCHAR',
  text : 'TEXT ',
  
  date: 'DATE',
  datetime: 'DATETIME',
  time: 'TIME',
  timestamp: 'TIMESTAMP',
};

/**
 * @private
 * @readonly
 * Query operators data types
 * @type {{[string]: Array<string>}}
 */
const OpTypes = {
  search: [
    'like', 'notLike',
    'iLike', 'notILike',
  ],
  boolean: [
    'not',
  ],
  scalar: [
    'gt', 'gte', 'gte', 'lt',
    'lte', 'ne', 'eq',
  ],
  arrays: [
    'in', 'notIn',
    'between', 'notBetween',
    'or', 'any',
    'contained', 'contains',
  ],
  objects: [
    'and',
  ],
};

/**
 * @private
 * @readonly
 * Sequelize query operators name
 * @type {Array<string>}
 */
const seqOpsName = Object.keys(seqOps);

/**
 * @private
 * @readonly
 * Top level sequelize operators
 * @type {Array<string>}
 */
const topLevelOps = ['and', 'or'];

/** FindOptions defaults options */
const findOptionsDefaultOptions = {
  jsonbCol: {
    alias: '$',
    name: 'meta',
  },
  excludeColumns: [],
  onlyColumns: [],
  columnAliases: {},
  excludePaths: [],
  noPathSearch: false,
  pathCallback: null,
  onlyPaths: [],
  propName: 'findOptions',
  astDefinitions: {},
};

/**
 * @private
 * @static
 * Check that given value is Scalar or not
 * @param {*} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */
const isScalar = val => R.is(Number, val) || R.is(String, val);

/**
 * @private
 * @static
 * Check that given value is Object or not
 * @param {*} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */

/**
 * @private
 * @static
 * Check that given value is object or not
 * @param {*} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */
const isObject = val => typeof val === 'object' && !Array.isArray(val);

/**
 * @private
 * @static
 * Check that given value is Array or not
 * @param {*} val - Value to check
 * @return {boolean} - True when valid / False otherwise
 */
const isArray = val => Array.isArray(val);

/**
 * @private
 * @static
 * Replace operator to sequelize operator
 * @param {string} op - Operator name
 * @return {Symbol} - Sequelize operator
 */
const replaceSeqOperators = ( op ) => {
  return Sequelize.Op[op];
};

/**
 * @private
 * @static
 * Render attributes based casts based on column name
 * @param {string} column - Column name
 * @param {{[string]: *}} attributes={} - Attributes data
 * @return {{[string]: string}} - Rendered casts {column: type}
 */
const renderCasts = ( column, attributes = {} ) => {
  /** @type {Object} */
  const casts = {};
  
  for ( let [
    /** @type {string} */ key,
    /** @type {*} */ value,
  ] of Object.entries(attributes) ) {
    if ( key !== 'cast'
      || !postgresBasicTypes.hasOwnProperty(value) ) {
      continue;
    }
    
    casts[column] = postgresBasicTypes[value];
  }
  
  return casts;
};

/**
 * @private
 * @static
 * Check that given value is a valid sequelize operator based value
 * @param {string} opr - Operator
 * @param {*} val - The value to check
 * @return {boolean} - True when valid / False otherwise
 */
const isValidOprValue = ( opr, val ) => {
  return !((OpTypes.search.includes(opr) && !hasValidSearchParam(val))
    || (OpTypes.boolean.includes(opr) && !R.is(Boolean, val))
    || (OpTypes.scalar.includes(opr) && !isScalar(val))
    || (OpTypes.arrays.includes(opr) && !isArray(val))
    || (OpTypes.objects.includes(opr) && !isObject(val))
    || (opr === 'or' && !isArrayOfObject(val)));
};

/**
 * @private
 * @static
 * Check that given value is has a search term or not
 * @param {string} value - The value
 * @return {boolean} - True when valid / False otherwise
 */
const hasValidSearchParam = value =>
  R.is(String, value) && /^([^%]+|%[^%]+|[^%]+%|%[^%]+%)$/.test(value);

/**
 * @private
 * @static
 * Check that given value is an array of objects
 * @param {*} value - The value
 * @return {boolean} - True when valid / False otherwise
 */
const isArrayOfObject = value => {
  let counts = 0;
  
  if ( !isArray(value) ) {
    return false;
  }
  
  value.forEach(item => counts += isObject(item));
  
  return counts === value.length;
};

/**
 * @private
 * @static
 * Get model attributes
 * @param {Sequelize~Model} model - Sequelize model
 * @param {Array<string>} exclude - Attributes name to be excluded
 * @return {Array<string>} - The attributes
 */
const modelAttributes = ( model, exclude = [] ) => {
  /** @type {string[]} */
  let attributes = Object.keys(model.rawAttributes);
  
  return !exclude.length
    ? attributes
    : attributes.filter(val => !exclude.includes(val));
};

/**
 * @private
 * @static
 * Get and parse `orderBy` value from request argument
 * @param {string} value - Sort order
 * @param {Object} options={} - Additional options
 * @param {string} options.primaryKey='id' - Primary key column name
 * @param {string} options.glueChar='_' - Glue char to create column name
 * @param {string} options.lang='en-US' - Language ISO (xx-XX)
 * @param {string} options.metaCol='meta' - Meta column name
 * @param {string} options.sortOrder='name' - Sort Order property name(e.g. i81n language label)
 * @param {string} options.sortOrderColumn='name' - Sort Order column name (e.g. title or name)
 * @param {ParseSortOrderOptions~callback} [options.callback] - Callback function to handle none-existing type
 * @param {function} [options.naturalCallback] - Callback function to handle 'natural' sort order type
 * @returns {{[string]: string}} - Parsed object (e.g., [string column, string order])
 */
const parseSortOrderValue = ( value, options = {} ) => {
  options = recursive(true, {
    primaryKey: 'id',
    glueChar: '_',
    lang: 'en-US',
    metaCol: 'meta',
    sortOrder: 'name',
    sortOrderColumn: 'name',
    callback: null,
    naturalCallback: null,
  }, options);
  
  value = value.toUpperCase();
  
  if ( 'NATURAL' === value ) {
    return typeof options.naturalCallback === 'function'
      ? options.naturalCallback()
      : [options.primaryKey, 'DESC'];
  }
  
  /** @type {string} */
  let lang = String(options.lang || '').replace('-', '_');
  
  /** @type {string[]} */
  let parts = value.split('_');
  
  let order = R.last(parts);
  let col = R.takeWhile(x => x !== order , parts).join(options.glueChar).toLowerCase();
  
  if ( col === 'language_text' ) {
    return [
      Sequelize.cast(Sequelize.fn('COALESCE',
        Sequelize.json(`${options.metaCol}.${lang}.${options.sortOrder}`),
        options.sortOrderColumn
      ), 'TEXT'),
      order,
    ];
  }
  
  if ( col === 'primary_key' ) {
    return [options.primaryKey, order];
  }
  
  if ( 'function' === typeof options.callback ) {
    return options.callback.call(null, col, order);
  }
  
  return [col, order];
};

/**
 * @private
 * @async
 * Get query requested fields counts
 * @param {Object} info - GraphQL Info object
 * @return {Promise<Object>} - Contained fields
 */
const getQueryFields = async info => await graphqlFields(info);

/**
 * @static
 * @private
 * @param {string} jsonbCol - JSONB column name
 * @param {*} value - Filtered value
 * @param {Object} [options] - Additional options
 * @param {Array<string>} options.exclude=[] - Excluded paths
 * @param {Array<string>} options.only=[] - Only allowed paths
 * @param {function(string, *):boolean} options.callback - A callback function to match and validate JSONB path
 * <br><code>function ( String <b>path</b>, Mixed <b>value</b> ) { return true; // False to skip }</code>
 * @param {sequelize~Model} options.model=null - Sequelize ORM Model
 * @return {Object|boolean} - Parsed columns / False on invalid
 * @throws {Error} - When parsing failed
 */
const parseJsonbAttribute = ( jsonbCol, value, options ) => {
  options = recursive(true, {
    exclude: [],
    only: [],
    callback: () => true,
    metaDefaults: null,
  }, options);
  
  const {metaDefaults} = options;
  
  let values = {};
  
  if ( !isObject(value) || !value.hasOwnProperty('path') ) {
    throw new Error (`Missing filter's path property`);
  }
  
  /** @type {Object} */
  let newValues = recursive(true, {
    path: '',
  }, value);
  
  /** @type {string} */
  let newPath = `${jsonbCol}.${newValues.path}`;
  
  // Invalid path
  if ( !/^([a-zA-Z_]+)(\.[a-zA-Z_]+)*$/.test(newPath) ) {
    throw new Error (`Invalid query path '${newValues.path}'`);
  }
  
  // Path is outside of allowed map
  if ( (options.exclude.length && options.exclude.includes(newValues.path))
    || ( options.only.length && !options.only.includes(newValues.path) ) ) {
    throw new Error (`Unknown path property '${newValues.path}'`);
  }
  
  // Path doesn't validate by a callback
  if ( options.callback.call(this, newValues.path, value) === false ) {
    throw new Error (`Invalid path property '${newValues.path}'`);
  }
  
  // Check path existence in `metaDefaults`
  if ( (metaDefaults !== null && Object.keys(metaDefaults).length)
    && !objectPath.has(metaDefaults, newPath)) {
    throw new Error (`Path '${newValues.path}' does not exist`);
  }
  
  delete newValues.path;
  
  /** @type {string[]} */
  let keys = Object.keys(newValues);
  
  if ( !keys.length ) {
    return false;
  }
  
  let counts = 0;
  
  /** @type {Object} */
  const casts = renderCasts(newPath, newValues);
  /** @type {boolean} */
  const isCasted = casts.hasOwnProperty(newPath);
  
  const validateProps = (prop, value) => {
    if ( seqOpsName.includes(prop) ) {
      return;
    }
    
    if ( prop === 'cast' ) {
      if ( !casts.hasOwnProperty(newPath) ) {
        throw new Error (`Invalid cast type '${value}'`);
      }
      return;
    }
    
    throw new Error (`Unknown property '${prop}'`);
  };
  
  for ( let prop of keys ) {
    const value = newValues[prop];
    
    validateProps(prop, value);
    
    let op = replaceSeqOperators(prop);
    
    if ( !op ) { continue; }
    
    counts++;
    values[op] = !isCasted
      ? value
      : Sequelize.cast(value, casts[newPath]);
  }
  
  if ( !counts ) {
    return false;
  }
  
  const colName = isCasted
    ? `${newPath}::${casts[newPath]}`
    : newPath;
  
  return {
    key: colName,
    values,
  };
};

/**
 * @private
 * @static
 * Sanitize `parseModelAttributes` object keys
 * @param {string} column - Filter name
 * @param {Array<string>} keys - The keys
 * @returns {Array<string>} - Filtered keys
 * @throws {Error} - When parsing failed
 */
const sanitizeModelKeys = ( column, keys ) => {
  if ( !keys.length ) {
    throw new Error (`Require property missing of '${column}'`);
  }
  
  for ( let k of keys ) {
    if ( seqOpsName.includes(k) ) {
      continue;
    }
    
    throw new Error (`Filter '${column}' contains unknown property '${k}'`);
  }
  
  return keys;
};

/**
 * @private
 * @static
 * Parse requested attributes/values and resole table column(s)
 * @param {Array<string>} modelColumns - Model (table) columns
 * @param {Object} attributes={} - Requested attributes
 * @param {Object} columnAliases={} - Column aliases to be replaced
 * @param {string} operator - Operator name
 * @return {Object|boolean} - Parsed columns / False on invalid
 * @throws {Error} - When parsing failed
 */
const parseModelAttributes = ( modelColumns, attributes = {}, columnAliases = {}, operator = null ) => {
  /** @type {Object} */
  let values = {};
  
  /** @type {string[]} */
  let props = Object.keys(attributes);
  
  for ( let prop of props ) {
    /** @type {string} */
    let column = String(prop);
    /** @type {*} */
    let val = attributes[column];
    /** @type {boolean} */
    const isAlias = column in columnAliases;
    
    // Skip unknown column
    if ( !modelColumns.includes(column) && !isAlias ) {
      throw new Error (`Operator '${operator}' contains invalid option: '${column}'`);
    }
    
    // Replace alias with actual column
    if ( isAlias ) {
      column = columnAliases[prop];
    }
    
    if ( R.is(Object, val) ) {
      /** @type {Object} */
      const casts = renderCasts(column, val);
      
      /** @type {number} */
      let total = 0;
      /** @type {Object} */
      let conditions = {};
      
      sanitizeModelKeys(column, Object.keys(val)).forEach(k => {
        /** @type {*} */
        let value = val[k];
        
        if ( seqOpsName.includes(k) && isValidOprValue(k, value) ) {
          /** @type {Symbol} */
          let oprVal = Sequelize.Op[k];
          
          conditions[oprVal] = !casts.hasOwnProperty(column)
            ? value
            : Sequelize.cast(value, casts[column]);
          total++;
        }
      });
      
      if ( total ) {
        const columnName = casts.hasOwnProperty(column)
          ? `${column}::${casts[column]}`
          : column;
        
        values[columnName] = conditions;
      }
      continue;
    }
    
    if ( isScalar(val)) {
      values[column] = val;
    }
  }
  
  return !Object.keys(values).length
    ? false
    : values;
};

/**
 * @private
 * @kind function
 * Top level sequelize operators parser
 * @param {string} k - The key pointer
 * @param {Object} internals - Internal data
 * @returns {boolean} - Skipped when true / False otherwise
 * @throws {Error} - When parsing failed
 */
const topLevelOpsParser = ( k, internals ) => {
  const {
    where, attributes, options,
    argsWhere, astDefinitions, hash,
  } = internals;
  
  if ( topLevelOps.includes(k) && isObject(argsWhere[k]) ) {
    /** @type {Object} */
    const val = recursive(true, {}, {...argsWhere[k]});
    
    /** @type {Object|boolean} */
    let parsed = parseModelAttributes(
      attributes, val, options.columnAliases, k,
    );
    
    if ( parsed !== false ) {
      astDefinitions[k] = val;
      where[Sequelize.Op[k]] = parsed;
      
      return true;
    }
  }
  
  return false;
};

/**
 * @private
 * @kind function
 * JSONB query advance options parser
 * @param {string} k - The key pointer
 * @param {Object} internals - Internal data
 * @returns {boolean} - Skipped when true / False otherwise
 * @throws {Error} - When parsing failed
 */
const JSONBQueryParser = ( k, internals ) => {
  const {
    where, options, argsWhere,
    astDefinitions, hash, metaDefaults
  } = internals;
  
  if ( k.startsWith('__') && !options.noPathSearch ) {
    /** @type {Object} */
    const val = {...argsWhere[k]};
    
    /** @type {Object|boolean} */
    const parsed = parseJsonbAttribute(
      options.jsonbCol.name, val, {
        exclude: options.excludePaths,
        only: options.onlyPaths,
        callback: options.pathCallback,
        metaDefaults,
      }
    );
    
    if ( parsed !== false ) {
      let hashed = createHashJson(val);
      
      if ( hash.includes(hashed) ) {
        throw new Error (`Option '${k}' contains duplicate filter(s)`);
      }
      
      astDefinitions[k] = val;
      hash.push(hashed);
      
      if ( !where.hasOwnProperty(parsed.key) ) {
        where[parsed.key] = parsed.values;
      } else {
        where[parsed.key] = {...where[parsed.key], ...parsed.values};
      }
      //console.log({key: parsed.key, values: parsed.values});
      //where[Sequelize.Op.and] = {[parsed.key]: parsed.values};
      
      return true;
    }
    
    throw new Error (`Option '${k}' contains invalid filter(s)`);
  }
  
  return false;
};

/**
 * @private
 * @kind function
 * Model attributes parser
 * @param {string} k - The key pointer
 * @param {Object} internals - Internal data
 * @returns {boolean} - Skipped when true / False otherwise
 * @throws {Error} - When parsing failed
 */
const modelAttributesParser = ( k, internals ) => {
  const {
    where, argsWhere, attributes,
    options, astDefinitions, hash,
  } = internals;
  
  if ( attributes.includes(k) || options.columnAliases.hasOwnProperty(k)) {
    /** @type {Object} */
    const val = {...argsWhere[k]};
    
    /** @type {Object|boolean} */
    const parsed = parseModelAttributes(attributes, {
      [k]: val
    }, options.columnAliases, k);
    
    if ( parsed !== false ) {
      astDefinitions[String(k)] = val;
      
      for ( let [
        /** @type {string} */ key,
        /** @type {*} */ value
      ] of Object.entries(parsed) ) {
        const [column, cast = null] = String(key).split('::');
        
        where[column] = !cast
          ? value
          : Sequelize.where(
            Sequelize.cast(Sequelize.col(column), cast), value
          );
      }
    }
    
    return true;
  }
  
  return false;
};

/**
 * A callback function to match and validate JSONB path
 * @callback ParseFindOptions~pathCallback
 * @param {string} path - The JSONB path (e.g., 'foo', 'foo.bar', ...)
 * @param {*} value - The value
 * @param {boolean} True to allow / False to skip
 */

/**
 * The `parseFindOptions` method has the following options
 * @typedef {Object} ParseFindOptions
 * @property {string} propName='findOptions' - FindOptions property name in args (Defaults to 'findOptions')
 * @property {Array<string>} onlyColumns=[] - Allow only these columns to be searched (Note: excludeColumns will be ignored) (Defaults to [])
 * @property {Array<string>} excludeColumns=[] - Columns to be excluded (e.g., ['foo', 'foo.bar', ...]) (Defaults to [])
 * @property {Object} columnAliases={} - Columns aliases be replaced from options (e.g., {'name': 'fullname', ...}) (Defaults to {})
 * @property {boolean} noPathSearch=false - Disable searching through JSONB path / False to allow (Defaults to false)
 * @property {Array<string>} excludePaths=[] - JSONB paths to be excluded (Note: excludePaths will be ignored) (Defaults to [])
 * @property {Array<string>} onlyPaths=[] - JSONB only paths allowed to be queried (e.g., ['foo', 'foo.bar', ...]) (Defaults to [])
 * @property {ParseFindOptions~pathCallback} pathCallback - A callback function to match and validate JSONB path (Defaults to null)
 * @property {Object} jsonbCol={} - Json column options (Defaults to {})
 * @property {string} jsonbCol.name='meta' - JSONB attribute name (Defaults to 'meta')
 * @property {Object} astDefinitions={} - Merge ast definitions into object
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Parse findOptions JSON data from GraphQL arguments and convert into sequelize where query
 * <b>Note:</b> JSONB column is excluded by default.
 * @param {Object} args - Request arguments
 * @param {Sequelize~Model} model - Sequelize model
 * @param {ParseFindOptions} options={} - Additional options
 * @returns {Object} - The parsed where query
 * @throws {Error} - When parsing failed
 */
function parseFindOptions ( args, model, options = {} ) {
  const astDefinitions = options.astDefinitions || {};
  
  const metaDefaults = typeof (model.metaDefaults || null) ==='function'
    ? model.metaDefaults()
    : null;
  
  options = recursive(true, findOptionsDefaultOptions, options);
  
  /** @type {Object} */
  let argsWhere = objectPath.get(args, options.propName, {}) || {};
  
  /** @type {string[]} */
  let whereKeys = Object.keys(argsWhere);
  
  if ( !whereKeys.length ) {
    return {};
  }
  
  options.excludeColumns.push(options.jsonbCol.name);
  
  options.pathCallback = typeof options.pathCallback === 'function'
    ? options.pathCallback
    : () => true;
  
  const attributes = options.onlyColumns.length
    ? options.onlyColumns
    : modelAttributes(model, options.excludeColumns);
  
  /** @type {Object} */
  const where = {};
  
  /** @type {Array<string>} */
  const hashTopLOpr = [];
  
  /** @type {Array<string>} */
  const hashJSONBQuery = [];
  
  /** @type {Array<string>} */
  const hashAttributes = [];
  
  for ( let k of whereKeys ) {
    // Parse sequelize operators
    if ( topLevelOpsParser(k, {
      options, where, argsWhere,
      attributes, astDefinitions, hash: hashTopLOpr,
    }) ) {
      continue;
    }
    
    // Parse JSONB queries
    if ( JSONBQueryParser(k, {
      options, where, argsWhere,
      astDefinitions, hash: hashJSONBQuery, metaDefaults,
    }) ) {
      continue;
    }
    
    // Parse model attributes
    if ( modelAttributesParser(k, {
      options, where, argsWhere,
      attributes, astDefinitions, hash: hashAttributes,
    }) ) {
      continue;
    }
    
    throw new Error (`Option '${k}' is unknown or invalid`);
  }
  
  return where;
}

/**
 * A callback function to handle none-existing type
 * @callback ParseSortOrderOptions~callback
 * @param {string} column - Sort column alias
 * @param {string} order - Sort order (ASC|DESC)
 * @returns {Array<string>} - The column definition [column, order]
 * @example
 * ( column, order ) => {
 *   if ( column === 'name' ) {
 *     // Set real column name
 *     column = 'fullname';
 *   }
 *   // Please note that order matters
 *   return [column, order];
 * }
 */

/**
 * The `parseSortOrder` method has the following options
 * @typedef {Object} ParseSortOrderOptions
 * @property {string} name - Name of query variable holding that value (Defaults to 'orderBy')
 * @property {string} default - Default value (Defaults to 'NATURAL')
 * @property {string} primaryKey - Primary key column name (Defaults to 'id')
 * @property {string} glueChar - Glue char to create column name (Defaults to '_')
 * @property {string} lang - Language ISO (xx-XX) (Defaults to 'en-US')
 * @property {string} metaCol - Meta column name (Defaults to 'meta')
 * @property {string} sortOrder - Sort Order property name (Defaults to 'sortOrder')
 * @property {ParseSortOrderOptions~callback} callback - Callback function to handle none-existing type
 * @property {function} naturalCallback - Callback function to handle 'natural' sort order type
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get and parse `orderBy` value from request argument
 * @param {Object} args - Request arguments
 * @param {ParseSortOrderOptions} options={} - Additional options
 * @returns {{string?: string}[]} - Parsed object (e.g., [string column, string order])
 */
function parseSortOrder ( args, options = {} ) {
  options = recursive(true, {
    name: 'sortOrder',
    default: 'NATURAL',
    primaryKey: 'id',
    glueChar: '_',
    lang: 'en-US',
    metaCol: 'meta',
    sortOrder: 'sortOrder',
    callback: null,
    naturalCallback: null,
  }, options);
  
  /** @type {string[]} */
  let list = objectPath.get(args, options.name, [options.default]) || [];
  
  if ( !list.length ) {
    return [
      [options.primaryKey, 'DESC'],
    ];
  }
  
  return list.map(val => parseSortOrderValue(val, options));
}

/**
 * The `parseValueFromArgs` method has the following options
 * @typedef {Object} ParseValueFromArgsOptions
 * @property {number} default - Default value (Defaults to 10)
 * @property {number} min - Minimum value (Defaults to 0)
 * @property {number} max -  Maximum value (Defaults to 0)
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get variable from arguments and parse as numeric
 * @param {string} name - Variable name
 * @param {Object} args - Request arguments
 * @param {ParseValueFromArgsOptions} options={} - Additional options
 * @returns {number} - The value
 */
function valueFromArgs ( name, args, options = {} ) {
  options = recursive(true, {
    default: 10,
    min: 0,
    max: 0,
  }, options);
  
  /** @type {number} */
  let value = Number(objectPath.get(args, name, options.default));
  
  if ( !value ) {
    return options.default;
  }
  
  if ( options.min && value < options.min ) {
    return options.min;
  }
  
  return options.max && value > options.max
    ? options.max
    : value;
}

/**
 * The `totalCount` method has the following options
 * @typedef {Object} CountTotalRowsOptions
 * @property {string} field - Default value (Defaults to 'totalCount')
 * @property {number} defaultVal - The default value to return if counts was skipped (Defaults to 0)
 * @property {sequelize.CountOptions} CountOptions - Sequelize Count options (Defaults to {})
 */

/**
 * @public
 * @static
 * @async
 * @namespace GraphqlFindOptions
 * Count the number of records matching the provided where clause.
 * @param {sequelize.Model} Model - Model object
 * @param {Object} info - GraphQL Info object
 * @param {sequelize.where} where={} - Where options
 * @param {CountTotalRowsOptions} options={} - Additional options
 * @return {Promise<number>} - Total counts
 */
async function totalCount ( Model, info, where = {}, options = {} ) {
  options = {
    field: 'totalCount',
    defaultVal: 0,
    countOptions: {},
    ...options,
  };
  
  /** @type {Object} */
  let fields = await getQueryFields(info);
  
  return fields.hasOwnProperty(options.field)
    ? await Model.count({...options.countOptions, where})
    : Promise.resolve(options.defaultVal);
}

/**
 * The pageInfo `cursors` Object
 * @typedef {Object} ConnectionCursorsObject
 * @property {number} before - The first record in the result serialized
 * @property {number} after - The last record in the result serialized
 * @property {boolean} hasNext - true or false depending on whether there are records after the after cursor
 * @property {boolean} hasPrevious - true or false depending on whether there are records before the before cursor
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get default cursors object (pagination related)
 * @return {ConnectionCursorsObject} - The object
 */
function defaultCursors () {
  return {
    before: null,
    after: null,
    hasNext: false,
    hasPrevious: false,
  };
}

/**
 * The pageInfo `pager` Object
 * @typedef {Object} ConnectionPagerObject
 * @property {number} pageCount - Total pages count
 * @property {?number} current - Current page
 * @property {?number} previous - Previous page
 * @property {?number} next - Next page
 * @property {?number} first - First page
 * @property {?number} last - Last page
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get default pagers object (pagination related)
 * @return {ConnectionPagerObject} - The object
 */
function defaultPagers () {
  return {
    current: null,
    previous: null,
    next: null,
    first: null,
    last: null,
    pageCount: 0,
  };
}

/**
 * The `parsePagerArg` method has the following options:
 * @typedef {Object} ParsePagerArgOptions
 * @property {?string} before - The first record in the result serialized (cursor pagination)
 * @property {?string} after - The last record in the result serialized (cursor pagination)
 * @property {number} limit - Limit of rows
 * @property {number} page - Current page (number pagination)
 * @property {'CURSOR'|'NUMBER'} type - Pagination style
 */

/**
 * The `parsePagerArg` returned object has the following properties:
 * @typedef {Object} ParsePagerArgReturns
 * @property {?string} before - The first record in the result serialized (cursor pagination)
 * @property {?string} after - The last record in the result serialized (cursor pagination)
 * @property {number} limit - Limit of rows
 * @property {number} page - Current page (number pagination)
 * @property {'CURSOR'|'NUMBER'} type - Pagination style
 * @property {function():boolean} isCursor - Pagination style is cursor or not
 * @property {function():boolean} isNumber - Pagination style is number or not
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get default pagers object (pagination related)
 * @param {Object} args - GraphQL request argument
 * @param {ParsePagerArgOptions} options={} - Options to override props
 * @return {ParsePagerArgReturns} - Argument data object
 */
function parsePagerArg ( args, options = {} ) {
  const data = recursive(true, {
    before: null,
    after: null,
    page: 1,
    limit: 10,
    type: PAGER_CURSOR,
  }, objectPath.get(args, 'pager', {}), options);
  
  data.isCursor = () => data.type === PAGER_CURSOR;
  data.isNumber = () => data.type === PAGER_NUMBER;
  
  return data;
}

/**
 * The `pageInfo` returns object with the following properties:
 * @typedef {Object} ConnectionObjectPageInfo
 * @property {ConnectionCursorsObject} cursors - Cursors object
 * @property {ConnectionPagerObject} pager - Pager object
 */

/**
 * The response connection object
 * @typedef {Object} ConnectionObject
 * @property {number} totalCount - Total counts
 * @property {ConnectionObjectPageInfo} pageInfo - pageInfo Object
 * @property {Object[]} nodes - Nodes list
 */

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Get empty connection object
 * @return {ConnectionObject} - The object
 */
function emptyConnectionObject () {
  return {
    totalCount: 0,
    pageInfo: {
      cursors: defaultCursors(),
      pager: defaultPagers(),
    },
    nodes: [],
  };
}

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Check that first sort order is DESC or not
 * @param {Array<[string, string]>} orders - Sort orders
 * @param {boolean} descOnSkip=false - If skipped, Set true to return as DESC / false as ASC
 * @returns {boolean} - True when DESC / false otherwise
 */
function isFirstOrderDesc ( orders, descOnSkip = false ) {
  if ( !Array.isArray(orders) || !orders.length ) {
    return descOnSkip;
  }
  
  /** @type {string[]} */
  let sortsList = orders.map(odr => odr[1]).slice(0,1);
  
  if ( !sortsList.length ) {
    return descOnSkip;
  }
  
  return typeof sortsList[0] === 'string'
    ? sortsList[0].toUpperCase() === 'DESC'
    : false;
}

/**
 * @public
 * @static
 * @namespace GraphqlFindOptions
 * Sanitized graphql filters data
 * @param {{[string]: *}} data - The data
 * @returns {{[string]: *}} - Filtered data
 */
function sanitizeFilters ( data ) {
  if ( !Object.keys(data).length ) {
    return {};
  }
  
  /** @type {{[string]: *}} */
  const newData = {};
  
  for ( let [k, v] of Object.entries(data) ) {
    if ( R.is(Array, v) ) {
      newData[k] = R.uniq(v);
    }
    
    if ( R.is(String, v) ) {
      newData[k] = R.trim(v);
    }
    
    // Otherwise
    newData[k] = v;
  }
  
  return newData;
}

/**
 * GraphQL sequelize find options utility functions
 * @example
 * const graphFindOpts = require('./graphql-find-options);
 */
module.exports = {
  parseFindOptions,
  parseSortOrder,
  valueFromArgs,
  totalCount,
  defaultCursors,
  defaultPagers,
  sanitizeFilters,
  parsePagerArg,
  emptyConnectionObject,
  isFirstOrderDesc,
  PAGER_NUMBER,
  PAGER_CURSOR,
};
