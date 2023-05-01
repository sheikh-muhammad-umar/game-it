const path = require('path');
const fs = require('fs');

/**
 * @public
 * Trait Json attribute
 * @type {string} */
const TRAIT_JSON_ATTRIBUTE = 'json-attribute';

/**
 * @public
 * Trait Orm attributes
 * @type {string} */
const TRAIT_ORM_ATTRIBUTES = 'orm-attributes';

/**
 * @public
 * Trait Pagination cursor
 * @type {string} */
const TRAIT_PAGINATION_CURSOR = 'pagination-cursor';

/**
 * @public
 * Trait Pagination number
 * @type {string} */
const TRAIT_PAGINATION_NUMBER = 'pagination-number';

/**
 * @public
 * Trait Status attribute
 * @type {string} */
const TRAIT_STATUS_ATTRIBUTE = 'status-attribute';

/**
 * @public
 * Trait Type attribute
 * @type {string} */
const TRAIT_TYPE_ATTRIBUTE = 'type-attribute';

/**
 * @public
 * @static
 * Bind traits with Sequelize model
 * @param {sequelize.Model} model - Sequelize ORM model
 * @param {Array<string>} traits - Traits list
 * @returns {void}
 */
function use ( model, traits = [] ) {
  // Skip
  if ( !traits.length ) { return; }
  
  for ( const trait of traits ) {
    /** @type {string} */
    const basePath = path.normalize(
      path.join(path.dirname(__dirname), 'traits', `${trait}.js`)
    );
    
    if ( !fs.existsSync(basePath) ) {
      throw new Error (`Trait '${trait}' does not exist.`);
    }
    
    require(basePath)(model);
  }
}

module.exports = {
  TRAIT_JSON_ATTRIBUTE,
  TRAIT_ORM_ATTRIBUTES,
  TRAIT_PAGINATION_CURSOR,
  TRAIT_PAGINATION_NUMBER,
  TRAIT_STATUS_ATTRIBUTE,
  TRAIT_TYPE_ATTRIBUTE,
  use,
};
