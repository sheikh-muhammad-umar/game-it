const objectPath = require('object-path');
const merge = require('merge');

/**
 * @package traits
 * Jsonb trait for sequelize model
 * @param {import('sequelize').Model} model - Sequelize model instance
 * @mixin JsonbTrait
 */
module.exports = model => {
  /**
   * @var {string} JsonTrait.jsonbAttribute
   * The json attribute
   * @default 'meta'
   */
  model.jsonbAttribute = 'meta';
  
  /**
   * Get json attribute value
   * @name JsonbTrait#getJsonAttributeValue
   * @param {string} attribute JSON Attribute name
   * @param {string} key Key name of the property followed by dots (.) element
   * @param {*} defaultValue the default value to be returned if the specified array key does not exist.
   * Not used when getting value from an object.
   * @return {(string|number|object|array|*)} the value of the element if found, default value otherwise
   */
  model.prototype.getJsonAttributeValue = function ( attribute, key, defaultValue = null ) {
    return objectPath.get(this.get(attribute), key, defaultValue);
  };
  
  /**
   * Set json attribute value
   * @name JsonbTrait#setJsonAttributeValue
   * @param {string} attribute JSON Attribute name
   * @param {Array<number|string>|number|string} path Key name of the property followed by dots (.) element
   * @param {(string|number|object|array|*)} value the value to be written
   */
  model.prototype.setJsonAttributeValue = function ( attribute, path, value ) {
    let newData = {};
    objectPath.set(newData, path, value);
    
    this.set(attribute, merge.recursive(
      true,
      this[model][attribute],
      newData
    ));
    this.changed(model.jsonbAttribute, true);
  };
  
  /**
   * Get json value
   * @name JsonbTrait#getJsonValue
   * @param {string} key Key name of the property followed by dots (.) element
   * @param {*} defaultValue the default value to be returned if the specified array key does not exist. Not used when
   * getting value from an object.
   * @return {(string|number|object|array|*)} the value of the element if found, default value otherwise
   */
  model.prototype.getJsonValue = function ( key, defaultValue = null ) {
    return objectPath.get(this.get(model.jsonbAttribute), key, defaultValue);
  };
  
  /**
   * Check that json path exists
   * @name JsonbTrait#hasJsonPath
   * @param {Array<number|string>|number|string} path Key name of the property followed by dots (.) element
   * getting value from an object.
   * @return {boolean} - True when exist / False otherwise
   */
  model.prototype.hasJsonPath = function ( path ) {
    return objectPath.has(this.get(model.jsonbAttribute), path);
  };
  
  /**
   * Set json value
   * @name JsonbTrait#setJsonValue
   * @param {Array<number|string>|number|string} path Key name of the property followed by dots (.) element
   * @param {(string|number|object|array|*)} value the value to be written
   */
  model.prototype.setJsonValue = function ( path, value ) {
    let newData = {};
    objectPath.set(newData, path, value);
    
    this.set(model.jsonbAttribute, merge.recursive(
      true,
      this[model.jsonbAttribute],
      newData
    ));
    this.changed(model.jsonbAttribute, true);
  };
  
  /**
   * Remove json by path
   * @name JsonbTrait#removeJsonPath
   * @param {Array<number|string>|number|string} path Key name of the property followed by dots (.) element
   */
  model.prototype.removeJsonPath = function ( path ) {
    let newData = {...this[model.jsonbAttribute]};
    objectPath.del(newData, path);
    
    this.set(model.jsonbAttribute, newData);
    this.changed(model.jsonbAttribute, true);
  };
  
  /**
   * Replace json attribute values
   * @name JsonbTrait#setJsonValues
   * @param {(string|number|object|array|*)} values the value to be written
   */
  model.prototype.setJsonValues = function ( values = {} ) {
    const updated = merge.recursive(
      true,
      this[model.jsonbAttribute],
      values
    );
    
    this.set(model.jsonbAttribute, updated);
    this.changed(model.jsonbAttribute, true);
  };
  
  /**
   * Overwrite json attribute value
   * @name JsonbTrait#overwriteJsonAttribute
   * @param {string} attribute - JSON Attribute name
   * @param {Array<number|string>|number|string} path - Key name of the property followed by dots (.) element
   * @param {*} value - The value to be written
   */
  model.prototype.overwriteJsonAttribute = function ( attribute, path, value ) {
    let attrValue = {...this[attribute]};
    objectPath.set(attrValue, path, value, false);
    this.set(attribute, attrValue);
    this.changed(attribute, true);
  };
  
  /**
   * Overwrite json attribute value
   * @name JsonbTrait#overwriteJsonValue
   * @param {Array<number|string>|number|string} path - Key name of the property followed by dots (.) element
   * @param {*} value - The value to be written
   */
  model.prototype.overwriteJsonValue = function ( path, value ) {
    let attrValue = this.get(model.jsonbAttribute);
    objectPath.set(attrValue, path, value, false);
    this.set(model.jsonbAttribute, attrValue);
    this.changed(model.jsonbAttribute, true);
  };
  
  /**
   * Increase or decrease json counter value
   * @name JsonbTrait#updateJsonCounter
   * @param {Array<number|string>|number|string} path - Key name of the property followed by dots (.) element
   */
  model.prototype.updateJsonCounter = function ( path ) {
    let current = Number(this.getJsonValue(path)) || 0;
    this.setJsonValue(path, current + 1);
  };
};
